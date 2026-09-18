"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isUniqueConflict } from "@/lib/prisma-errors";
import { requireAdmin } from "@/lib/session";

export type AdminState = { error?: string; success?: string };

export async function createAgencyAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin("/admin/agencies");
  const parsed = z
    .object({
      name: z.string().min(2),
      city: z.string().min(2),
      code: z.string().min(2).max(8),
    })
    .safeParse({
      name: formData.get("name"),
      city: formData.get("city"),
      code: formData.get("code"),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    await prisma.agency.create({
      data: {
        name: parsed.data.name,
        city: parsed.data.city,
        code: parsed.data.code.toUpperCase(),
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) return { error: "That agency code is already in use" };
    throw error;
  }

  revalidatePath("/admin/agencies");
  revalidatePath("/admin");
  return { success: "Agency added" };
}

export async function createStaffAction(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  await requireAdmin("/admin/people");
  const parsed = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      password: z.string().min(8),
      role: z.enum(["AGENT", "OWNER"]),
      agencyId: z.string().optional(),
      licenseNumber: z.string().optional(),
    })
    .safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      password: formData.get("password"),
      role: formData.get("role"),
      agencyId: formData.get("agencyId") || undefined,
      licenseNumber: formData.get("licenseNumber") || undefined,
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  if (parsed.data.role === "AGENT" && (!parsed.data.agencyId || !parsed.data.licenseNumber)) {
    return { error: "Agents need an agency and a licence number" };
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
        role: parsed.data.role,
        agentProfile:
          parsed.data.role === "AGENT"
            ? {
                create: {
                  licenseNumber: parsed.data.licenseNumber!,
                  agencyId: parsed.data.agencyId!,
                },
              }
            : undefined,
        ownerProfile: parsed.data.role === "OWNER" ? { create: {} } : undefined,
      },
    });
  } catch (error) {
    if (isUniqueConflict(error)) return { error: "An account with this email already exists" };
    throw error;
  }

  revalidatePath("/admin/people");
  return { success: `${parsed.data.role === "AGENT" ? "Agent" : "Landlord"} account created` };
}

export async function archiveListingAction(formData: FormData) {
  await requireAdmin("/admin/listings");
  const id = String(formData.get("id") ?? "");
  await prisma.listing.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/admin/listings");
  revalidatePath("/listings");
}
