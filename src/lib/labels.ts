import type {
  ApplicationStatus,
  InvoiceStatus,
  LeaseStatus,
  ListingKind,
  ListingStatus,
  PropertyType,
  TicketStatus,
  ViewingStatus,
} from "@prisma/client";

export const kindLabel: Record<ListingKind, string> = {
  RENT: "To let",
  SALE: "For sale",
  LAND: "Land",
};

export const typeLabel: Record<PropertyType, string> = {
  FLAT: "Flat",
  DUPLEX: "Duplex",
  BUNGALOW: "Bungalow",
  TERRACE: "Terrace",
  LAND: "Plot",
  SHOP: "Shop",
  OFFICE: "Office",
};

export const listingStatusLabel: Record<ListingStatus, string> = {
  DRAFT: "Draft",
  LIVE: "Live",
  UNDER_OFFER: "Under offer",
  LET: "Let",
  SOLD: "Sold",
  ARCHIVED: "Archived",
};

export const viewingStatusLabel: Record<ViewingStatus, string> = {
  SCHEDULED: "Scheduled",
  DONE: "Done",
  NO_SHOW: "No-show",
  CANCELLED: "Cancelled",
};

export const applicationStatusLabel: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  DECLINED: "Declined",
};

export const leaseStatusLabel: Record<LeaseStatus, string> = {
  ACTIVE: "Active",
  NOTICE: "Notice",
  ENDED: "Ended",
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  DUE: "Due",
  PAID: "Paid",
  OVERDUE: "Overdue",
};

export const ticketStatusLabel: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

export const cities = ["Lagos", "Abuja", "Ibadan", "Port Harcourt"] as const;
