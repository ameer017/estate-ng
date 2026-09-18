"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ApplicationStatus, ListingKind, ListingStatus, PropertyType, TicketStatus, ViewingStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { listingRef, slugify } from "@/lib/utils";
import { requireAgent } from "@/lib/session";
import { nairaToKobo } from "@/lib/money";

export type AgentState = { error?: string; success?: string };

const listingSchema = z.object({
  title: z.string().min(4, "Give the listing a title"),
  summary: z.string().min(12, "Write a short summary"),
  city: z.string().min(2),
  area: z.string().min(2),
  address: z.string().min(4),
  kind: z.enum(["RENT", "SALE", "LAND"]),
  type: z.enum(["FLAT", "DUPLEX", "BUNGALOW", "TERRACE", "LAND", "SHOP", "OFFICE"]),
  beds: z.coerce.number().int().min(0).max(20),
  baths: z.coerce.number().int().min(0).max(20),
  toilets: z.coerce.number().int().min(0).max(20),
  sqm: z.coerce.number().int().min(0).optional(),
  priceNaira: z.coerce.number().positive("Enter a price in naira"),
  serviceNaira: z.coerce.number().min(0).optional(),
  furnished: z.coerce.boolean().optional(),
  amenities: z.string().optional(),
  ownerEmail: z.string().email().optional().or(z.literal("")),
});

export async function createListingAction(
  _prev: AgentState,
  formData: FormData,
): Promise<AgentState> {
  const session = await requireAgent("/agent/new");
  const parsed = listingSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
    city: formData.get("city"),
    area: formData.get("area"),
    address: formData.get("address"),
    kind: formData.get("kind"),
    type: formData.get("type"),
    beds: formData.get("beds") || 0,
    baths: formData.get("baths") || 0,
    toilets: formData.get("toilets") || 0,
    sqm: formData.get("sqm") || undefined,
    priceNaira: formData.get("priceNaira"),
    serviceNaira: formData.get("serviceNaira") || 0,
    furnished: formData.get("furnished") === "on",
    amenities: formData.get("amenities") || undefined,
    ownerEmail: formData.get("ownerEmail") || "",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const agent = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { agentProfile: true },
  });
  if (!agent?.agentProfile) {
    return { error: "Your agent profile is missing. Ask the operator to fix it." };
  }

  let ownerId: string | undefined;
  if (parsed.data.ownerEmail) {
    const owner = await prisma.user.findUnique({
      where: { email: parsed.data.ownerEmail.toLowerCase() },
    });
    if (!owner || owner.role !== "OWNER") {
      return { error: "No landlord account matches that email" };
    }
    ownerId = owner.id;
  }

  const slugBase = slugify(parsed.data.title) || "listing";
  let slug = slugBase;
  const clash = await prisma.listing.findUnique({ where: { slug } });
  if (clash) slug = `${slugBase}-${listingRef().toLowerCase()}`;

  const listing = await prisma.listing.create({
    data: {
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      city: parsed.data.city,
      area: parsed.data.area,
      address: parsed.data.address,
      kind: parsed.data.kind as ListingKind,
      type: parsed.data.type as PropertyType,
      status: "LIVE",
      beds: parsed.data.beds,
      baths: parsed.data.baths,
      toilets: parsed.data.toilets,
      sqm: parsed.data.sqm || null,
      priceKobo: nairaToKobo(parsed.data.priceNaira),
      serviceKobo: nairaToKobo(parsed.data.serviceNaira ?? 0),
      furnished: Boolean(parsed.data.furnished),
      amenities: parsed.data.amenities
        ? parsed.data.amenities.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
      agencyId: agent.agentProfile.agencyId,
      agentId: agent.id,
      ownerId,
    },
  });

  revalidatePath("/listings");
  revalidatePath("/agent");
  revalidatePath("/agent/listings");
  redirect(`/listings/${listing.slug}`);
}

export async function setListingStatusAction(formData: FormData) {
  const session = await requireAgent("/agent/listings");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ListingStatus;
  const allowed: ListingStatus[] = ["LIVE", "UNDER_OFFER", "LET", "SOLD", "ARCHIVED"];
  if (!allowed.includes(status)) return;

  await prisma.listing.updateMany({
    where: { id, agentId: session.user.id },
    data: { status },
  });

  revalidatePath("/agent/listings");
  revalidatePath("/listings");
  revalidatePath("/admin/listings");
}

export async function closeEnquiryAction(formData: FormData) {
  const session = await requireAgent("/agent/enquiries");
  const id = String(formData.get("id") ?? "");
  await prisma.enquiry.updateMany({
    where: { id, listing: { agentId: session.user.id } },
    data: { status: "CLOSED" },
  });
  revalidatePath("/agent/enquiries");
}

export async function setViewingStatusAction(formData: FormData) {
  const session = await requireAgent("/agent/viewings");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ViewingStatus;
  const allowed: ViewingStatus[] = ["DONE", "NO_SHOW", "CANCELLED"];
  if (!allowed.includes(status)) return;

  await prisma.viewing.updateMany({
    where: { id, listing: { agentId: session.user.id } },
    data: { status },
  });
  revalidatePath("/agent/viewings");
}

export async function decideApplicationAction(formData: FormData) {
  const session = await requireAgent("/agent");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;
  if (status !== "APPROVED" && status !== "DECLINED") return;

  const application = await prisma.application.findFirst({
    where: { id, listing: { agentId: session.user.id } },
    include: { listing: true },
  });
  if (!application) return;

  await prisma.application.update({ where: { id }, data: { status } });

  if (status === "APPROVED" && application.listing.kind === "RENT") {
    const start = new Date();
    const end = new Date();
    end.setFullYear(end.getFullYear() + 1);
    const reference = `LS-${listingRef()}-${new Date().getFullYear()}`;
    const invoiceRef = `INV-${listingRef()}-${new Date().getFullYear()}`;

    await prisma.$transaction([
      prisma.listing.update({
        where: { id: application.listingId },
        data: { status: "LET" },
      }),
      prisma.lease.create({
        data: {
          reference,
          listingId: application.listingId,
          tenantId: application.userId,
          startDate: start,
          endDate: end,
          rentKobo: application.listing.priceKobo,
          depositKobo: application.listing.priceKobo / BigInt(2),
          invoices: {
            create: {
              reference: invoiceRef,
              periodLabel: `${start.getFullYear()} term`,
              dueDate: start,
              amountKobo: application.listing.priceKobo,
              status: "DUE",
            },
          },
        },
      }),
    ]);
  }

  revalidatePath("/agent");
  revalidatePath("/dashboard");
  revalidatePath("/tenancy");
  revalidatePath("/listings");
  revalidatePath("/owner");
}

export async function setTicketStatusAction(formData: FormData) {
  const session = await requireAgent("/agent");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TicketStatus;
  const allowed: TicketStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED"];
  if (!allowed.includes(status)) return;

  await prisma.maintenanceTicket.updateMany({
    where: { id, listing: { agentId: session.user.id } },
    data: {
      status,
      resolvedAt: status === "RESOLVED" ? new Date() : null,
    },
  });
  revalidatePath("/agent");
  revalidatePath("/tenancy");
  revalidatePath("/owner/tickets");
}
