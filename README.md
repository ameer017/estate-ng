# EstateNG

A comprehensive Nigerian real estate platform where seekers browse rentals, sales, and land plots, while agents handle leads, landlords track occupancy, and tenants pay rent using an integrated wallet.

## Setup

```bash
cd estate-ng
npm install
cp .env.example .env
docker compose up -d
npm run db:setup
npm run dev
```

Local Postgres is `postgresql://estateng:estateng@localhost:5434/estateng` (port **5434** so RailNG can keep 5432 and MediVault 5433). SQLite will not work on Netlify.

Open [http://localhost:3000](http://localhost:3000). Live site: [https://estate-ng.netlify.app](https://estate-ng.netlify.app).

## Seed logins

| Role | Email | Password |
| --- | --- | --- |
| Operator | `admin@estateng.ng` | `Estate!admin` |
| Agent | `kemi@estateng.ng` | `agent123` |
| Landlord | `chinedu@estateng.ng` | `owner123` |
| Tenant | `amina@estateng.ng` | `tenant123` |

Amina already rents the Yaba 2-bed (`LS-YBA-2401`). 2026 rent is due. Kemi (Iroko Homes) has a pending application on the Lekki terrace.

## What is included

- Search listings by city, offer type (to let / sale / land) and area
- Enquire, book a viewing, apply to rent
- Tenant desk: lease, mock rent checkout, maintenance tickets
- Agent desk: stock, enquiries, viewings, approve-and-cut-lease
- Landlord desk: portfolio, leases, tickets
- Operator: agencies, people, listing archive

## Payments

Rent checkout calls `paymentProvider.charge()` in `src/lib/payments.ts`. v1 uses `MockPaymentProvider`.

## Deploy on Netlify

1. Create a free [Neon](https://neon.tech) Postgres database. Copy the connection string (`sslmode=require`).
2. Import the GitHub repo in Netlify, or deploy with the CLI from this folder (`netlify deploy --build --prod`). Live site: [https://estate-ng.netlify.app](https://estate-ng.netlify.app).
3. Site settings → Environment variables:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_URL` | your Netlify URL |

4. Trigger a deploy. The build runs `prisma generate` and `prisma db push` (schema only, no seed wipe).
5. Seed once from your machine:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

Then log in with the seed accounts above.
