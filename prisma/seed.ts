import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function monthsFromNow(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

function monthsAgo(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date;
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function main() {
  await prisma.maintenanceTicket.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.lease.deleteMany();
  await prisma.application.deleteMany();
  await prisma.viewing.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.agentProfile.deleteMany();
  await prisma.ownerProfile.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.user.deleteMany();

  const [adminHash, agentHash, ownerHash, tenantHash] = await Promise.all([
    bcrypt.hash("Estate!admin", 10),
    bcrypt.hash("agent123", 10),
    bcrypt.hash("owner123", 10),
    bcrypt.hash("tenant123", 10),
  ]);

  await prisma.user.create({
    data: {
      email: "admin@estateng.ng",
      passwordHash: adminHash,
      name: "EstateNG Operator",
      role: "ADMIN",
    },
  });

  const iroko = await prisma.agency.create({
    data: { name: "Iroko Homes", city: "Lagos", code: "IRK" },
  });
  await prisma.agency.create({
    data: { name: "Harmattan Desk", city: "Abuja", code: "HMD" },
  });
  await prisma.agency.create({
    data: { name: "Cocoa Court", city: "Ibadan", code: "CCA" },
  });

  const kemi = await prisma.user.create({
    data: {
      email: "kemi@estateng.ng",
      passwordHash: agentHash,
      name: "Kemi Adewale",
      phone: "+2348091112233",
      role: "AGENT",
      agentProfile: {
        create: { licenseNumber: "EDO-LS-88421", agencyId: iroko.id },
      },
    },
  });

  const ibrahim = await prisma.user.create({
    data: {
      email: "ibrahim@estateng.ng",
      passwordHash: agentHash,
      name: "Ibrahim Sani",
      phone: "+2348083344556",
      role: "AGENT",
      agentProfile: {
        create: { licenseNumber: "EDO-ABJ-11902", agencyId: iroko.id },
      },
    },
  });

  const chinedu = await prisma.user.create({
    data: {
      email: "chinedu@estateng.ng",
      passwordHash: ownerHash,
      name: "Chinedu Okoro",
      phone: "+2348035566778",
      role: "OWNER",
      ownerProfile: { create: { bank: "GTBank · 0123456789" } },
    },
  });

  const amina = await prisma.user.create({
    data: {
      email: "amina@estateng.ng",
      passwordHash: tenantHash,
      name: "Amina Bello",
      phone: "+2348012345678",
      role: "TENANT",
    },
  });

  const yaba = await prisma.listing.create({
    data: {
      slug: "yaba-2bed-serviced-flat",
      title: "Serviced 2-bed in Yaba",
      summary:
        "Quiet compound off Herbert Macaulay. Inverter, borehole, and a 5-minute walk to the UNILAG second gate.",
      city: "Lagos",
      area: "Yaba",
      address: "14 Hughes Avenue, Yaba",
      kind: "RENT",
      type: "FLAT",
      status: "LET",
      beds: 2,
      baths: 2,
      toilets: 2,
      sqm: 95,
      priceKobo: 2_400_000_00,
      serviceKobo: 250_000_00,
      furnished: true,
      amenities: ["Inverter", "Borehole", "Security", "POP ceiling", "Prepaid meter"],
      accent: "clay",
      agencyId: iroko.id,
      agentId: kemi.id,
      ownerId: chinedu.id,
    },
  });

  const lekki = await prisma.listing.create({
    data: {
      slug: "lekki-phase-1-4bed-terrace",
      title: "4-bed terrace, Lekki Phase 1",
      summary: "Corner unit on a gated street. BQ, fitted kitchen, and space for two cars.",
      city: "Lagos",
      area: "Lekki Phase 1",
      address: "Admiralty Way, Lekki Phase 1",
      kind: "RENT",
      type: "TERRACE",
      status: "LIVE",
      beds: 4,
      baths: 4,
      toilets: 5,
      sqm: 280,
      priceKobo: 12_000_000_00,
      serviceKobo: 1_200_000_00,
      furnished: false,
      amenities: ["BQ", "Fitted kitchen", "24h security", "Tarred street", "Estate power"],
      accent: "gold",
      agencyId: iroko.id,
      agentId: kemi.id,
      ownerId: chinedu.id,
    },
  });

  const ikoyi = await prisma.listing.create({
    data: {
      slug: "ikoyi-3bed-apartment-sale",
      title: "3-bed apartment, Old Ikoyi",
      summary: "Sixth floor with lagoon glimpses. Service charge covers diesel, water, and concierge.",
      city: "Lagos",
      area: "Ikoyi",
      address: "Bourdillon Road, Ikoyi",
      kind: "SALE",
      type: "FLAT",
      status: "LIVE",
      beds: 3,
      baths: 3,
      toilets: 4,
      sqm: 185,
      priceKobo: 185_000_000_00,
      serviceKobo: 2_400_000_00,
      furnished: false,
      amenities: ["Lift", "Gym", "Concierge", "Backup power", "Water treatment"],
      accent: "ink",
      agencyId: iroko.id,
      agentId: kemi.id,
    },
  });

  const abeokutaLand = await prisma.listing.create({
    data: {
      slug: "epe-500sqm-dry-land",
      title: "500 sqm dry land, Epe",
      summary: "C of O in process. Survey beacons in, 8 minutes off the Lagos–Epe expressway.",
      city: "Lagos",
      area: "Epe",
      address: "Km 42 Lagos–Epe Expressway",
      kind: "LAND",
      type: "LAND",
      status: "LIVE",
      beds: 0,
      baths: 0,
      toilets: 0,
      sqm: 500,
      priceKobo: 18_500_000_00,
      furnished: false,
      amenities: ["Dry land", "Surveyed", "Estate layout", "Access road"],
      accent: "sand",
      agencyId: iroko.id,
      agentId: kemi.id,
    },
  });

  const maitama = await prisma.listing.create({
    data: {
      slug: "maitama-5bed-duplex",
      title: "5-bed duplex, Maitama",
      summary: "Detached house on a quiet crescent. Boys’ quarters, generator house, and a small pool.",
      city: "Abuja",
      area: "Maitama",
      address: "Lake Chad Crescent, Maitama",
      kind: "RENT",
      type: "DUPLEX",
      status: "LIVE",
      beds: 5,
      baths: 5,
      toilets: 6,
      sqm: 420,
      priceKobo: 25_000_000_00,
      serviceKobo: 0,
      furnished: true,
      amenities: ["Pool", "BQ", "Generator", "CCTV", "Water tank"],
      accent: "ink",
      agencyId: iroko.id,
      agentId: ibrahim.id,
      ownerId: chinedu.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "gwarinpa-3bed-bungalow",
      title: "3-bed bungalow, Gwarinpa",
      summary: "Owner-occupied until December. Clean compound, two-car parking, prepaid meter.",
      city: "Abuja",
      area: "Gwarinpa",
      address: "1st Avenue, Gwarinpa",
      kind: "SALE",
      type: "BUNGALOW",
      status: "UNDER_OFFER",
      beds: 3,
      baths: 3,
      toilets: 3,
      sqm: 160,
      priceKobo: 68_000_000_00,
      furnished: false,
      amenities: ["Parking", "Prepaid meter", "Fence", "Water"],
      accent: "clay",
      agencyId: iroko.id,
      agentId: ibrahim.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "bodija-2bed-mini-flat",
      title: "Mini-flat, Bodija",
      summary: "Upstairs unit near the market. Tiled throughout, shared compound of four flats.",
      city: "Ibadan",
      area: "Bodija",
      address: "Awolowo Avenue, Bodija",
      kind: "RENT",
      type: "FLAT",
      status: "LIVE",
      beds: 2,
      baths: 1,
      toilets: 2,
      sqm: 70,
      priceKobo: 850_000_00,
      serviceKobo: 50_000_00,
      furnished: false,
      amenities: ["Tiled", "Water", "Security gate"],
      accent: "sand",
      agencyId: iroko.id,
      agentId: kemi.id,
    },
  });

  await prisma.listing.create({
    data: {
      slug: "ph-gra-shop-front",
      title: "Shop front, Port Harcourt GRA",
      summary: "Ground-floor lock-up with a small store at the back. High foot traffic on Tombia Street.",
      city: "Port Harcourt",
      area: "GRA",
      address: "Tombia Street, GRA Phase 2",
      kind: "RENT",
      type: "SHOP",
      status: "LIVE",
      beds: 0,
      baths: 1,
      toilets: 1,
      sqm: 42,
      priceKobo: 3_600_000_00,
      furnished: false,
      amenities: ["Roller shutter", "Store", "Parking bay"],
      accent: "gold",
      agencyId: iroko.id,
      agentId: ibrahim.id,
    },
  });

  await prisma.enquiry.create({
    data: {
      listingId: lekki.id,
      userId: amina.id,
      message: "Can I view this Saturday after 2pm? Coming from Yaba.",
    },
  });

  await prisma.enquiry.create({
    data: {
      listingId: ikoyi.id,
      userId: amina.id,
      message: "Is the service charge inclusive of diesel? Also asking for the service charge history.",
      status: "CLOSED",
    },
  });

  await prisma.viewing.create({
    data: {
      listingId: lekki.id,
      userId: amina.id,
      startsAt: daysFromNow(2),
      notes: "Saturday 3pm. Meet at the gatehouse.",
    },
  });

  await prisma.viewing.create({
    data: {
      listingId: maitama.id,
      userId: amina.id,
      startsAt: daysAgo(5),
      status: "DONE",
      notes: "Walked the compound. Client liked the pool.",
    },
  });

  await prisma.application.create({
    data: {
      listingId: lekki.id,
      userId: amina.id,
      note: "Relocating from Yaba. Can pay one year upfront.",
      status: "PENDING",
    },
  });

  const lease = await prisma.lease.create({
    data: {
      reference: "LS-YBA-2401",
      listingId: yaba.id,
      tenantId: amina.id,
      startDate: monthsAgo(8),
      endDate: monthsFromNow(4),
      rentKobo: 2_400_000_00,
      depositKobo: 1_200_000_00,
      status: "ACTIVE",
    },
  });

  await prisma.invoice.create({
    data: {
      reference: "INV-YBA-2025",
      leaseId: lease.id,
      periodLabel: "Jan–Dec 2025",
      dueDate: daysAgo(400),
      amountKobo: 2_400_000_00,
      status: "PAID",
      paidAt: daysAgo(410),
      paymentId: "mock_INV-YBA-2025",
    },
  });

  await prisma.invoice.create({
    data: {
      reference: "INV-YBA-2026",
      leaseId: lease.id,
      periodLabel: "Jan–Dec 2026",
      dueDate: daysFromNow(18),
      amountKobo: 2_400_000_00,
      status: "DUE",
    },
  });

  await prisma.maintenanceTicket.create({
    data: {
      listingId: yaba.id,
      leaseId: lease.id,
      reporterId: amina.id,
      assigneeId: kemi.id,
      title: "Kitchen tap dripping",
      detail: "Cold tap at the sink won’t shut fully. Plumber came once last year.",
      status: "IN_PROGRESS",
    },
  });

  await prisma.maintenanceTicket.create({
    data: {
      listingId: yaba.id,
      leaseId: lease.id,
      reporterId: amina.id,
      title: "Compound light at the gate",
      detail: "The PIR light at the pedestrian gate is dead. Dark after 7pm.",
      status: "OPEN",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
