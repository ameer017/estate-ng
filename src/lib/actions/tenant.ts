"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payments";
import { requireTenant, requireUser } from "@/lib/session";

export type FormState = { error?: string; success?: string };

export async function sendEnquiryAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/listings/${formData.get("slug") ?? ""}`);
  }

  const parsed = z
    .object({
      listingId: z.string().min(1),
      message: z.string().min(8, "Write a short note so the agent can help"),
    })
    .safeParse({
      listingId: formData.get("listingId"),
      message: formData.get("message"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: { id: true, slug: true, status: true },
  });
  if (!listing || listing.status === "ARCHIVED") {
    return { error: "This listing is no longer available" };
  }

  await prisma.enquiry.create({
    data: {
      listingId: listing.id,
      userId: session.user.id,
      message: parsed.data.message,
    },
  });

  revalidatePath(`/listings/${listing.slug}`);
  revalidatePath("/enquiries");
  revalidatePath("/agent/enquiries");
  return { success: "Enquiry sent. The agent will pick it up on their desk." };
}

export async function bookViewingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireUser();
  const parsed = z
    .object({
      listingId: z.string().min(1),
      startsAt: z.string().min(1, "Pick a date and time"),
      notes: z.string().optional(),
    })
    .safeParse({
      listingId: formData.get("listingId"),
      startsAt: formData.get("startsAt"),
      notes: formData.get("notes") || undefined,
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const startsAt = new Date(parsed.data.startsAt);
  if (Number.isNaN(startsAt.getTime()) || startsAt.getTime() < Date.now()) {
    return { error: "Pick a future viewing slot" };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: { id: true, slug: true, status: true },
  });
  if (!listing || listing.status === "ARCHIVED" || listing.status === "SOLD" || listing.status === "LET") {
    return { error: "This home is not open for viewings" };
  }

  await prisma.viewing.create({
    data: {
      listingId: listing.id,
      userId: session.user.id,
      startsAt,
      notes: parsed.data.notes,
    },
  });

  revalidatePath(`/listings/${listing.slug}`);
  revalidatePath("/enquiries");
  revalidatePath("/agent/viewings");
  return { success: "Viewing booked. You’ll see it on your enquiries page." };
}

export async function applyToRentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireTenant("/dashboard");
  const parsed = z
    .object({
      listingId: z.string().min(1),
      note: z.string().optional(),
    })
    .safeParse({
      listingId: formData.get("listingId"),
      note: formData.get("note") || undefined,
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: { id: true, slug: true, kind: true, status: true },
  });
  if (!listing || listing.kind !== "RENT" || listing.status !== "LIVE") {
    return { error: "Applications are only open on live rental listings" };
  }

  const existing = await prisma.application.findFirst({
    where: { listingId: listing.id, userId: session.user.id, status: "PENDING" },
  });
  if (existing) {
    return { error: "You already have a pending application on this home" };
  }

  await prisma.application.create({
    data: {
      listingId: listing.id,
      userId: session.user.id,
      note: parsed.data.note,
    },
  });

  revalidatePath(`/listings/${listing.slug}`);
  revalidatePath("/dashboard");
  revalidatePath("/agent");
  return { success: "Application submitted. The agent will review it." };
}

export async function openTicketAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireTenant("/tenancy");
  const parsed = z
    .object({
      title: z.string().min(4, "Give the issue a title"),
      detail: z.string().min(8, "Describe what needs fixing"),
    })
    .safeParse({
      title: formData.get("title"),
      detail: formData.get("detail"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const lease = await prisma.lease.findFirst({
    where: { tenantId: session.user.id, status: { in: ["ACTIVE", "NOTICE"] } },
    include: { listing: { select: { id: true, agentId: true } } },
  });
  if (!lease) {
    return { error: "You need an active lease to raise a ticket" };
  }

  await prisma.maintenanceTicket.create({
    data: {
      listingId: lease.listing.id,
      leaseId: lease.id,
      reporterId: session.user.id,
      assigneeId: lease.listing.agentId,
      title: parsed.data.title,
      detail: parsed.data.detail,
    },
  });

  revalidatePath("/tenancy");
  revalidatePath("/agent");
  revalidatePath("/owner/tickets");
  return { success: "Ticket opened. The agent has been assigned." };
}

export async function payInvoiceAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const session = await requireTenant();
  const invoiceId = String(formData.get("invoiceId") ?? "");
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { lease: true },
  });

  if (!invoice || invoice.lease.tenantId !== session.user.id) {
    return { error: "Invoice not found" };
  }
  if (invoice.status === "PAID") {
    return { error: "This invoice is already paid" };
  }

  const charge = await paymentProvider.charge({
    amountKobo: Number(invoice.amountKobo),
    reference: invoice.reference,
    email: session.user.email ?? "",
  });

  if (!charge.success) {
    return { error: "Payment did not go through. Try again." };
  }

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      paymentId: charge.paymentId,
    },
  });

  revalidatePath("/tenancy");
  revalidatePath(`/pay/${invoice.id}`);
  revalidatePath("/owner");
  revalidatePath("/admin");
  redirect("/tenancy");
}
