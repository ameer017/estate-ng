"use client";

import { useActionState } from "react";
import { loginAction, registerAction, type AuthState } from "@/lib/actions/auth";
import {
  applyToRentAction,
  bookViewingAction,
  openTicketAction,
  payInvoiceAction,
  sendEnquiryAction,
  type FormState,
} from "@/lib/actions/tenant";
import { createListingAction, type AgentState } from "@/lib/actions/agent";
import { createAgencyAction, createStaffAction, type AdminState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { ErrorBox, SuccessBox } from "@/components/states";
import { cities } from "@/lib/labels";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState(loginAction, {} as AuthState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@email.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {} as AuthState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Amina Bello" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" placeholder="0801 234 5678" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Opening desk…" : "Create tenant account"}
      </Button>
    </form>
  );
}

export function EnquiryForm({ listingId, slug }: { listingId: string; slug: string }) {
  const [state, action, pending] = useActionState(sendEnquiryAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="slug" value={slug} />
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          minLength={8}
          rows={4}
          placeholder="When can I view? Asking about service charge…"
          className="w-full rounded-sm border border-[var(--line)] bg-[var(--panel)] px-3.5 py-3 text-sm outline-none ring-[var(--teal)] focus:ring-2"
        />
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}

export function ViewingForm({ listingId }: { listingId: string }) {
  const [state, action, pending] = useActionState(bookViewingAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <input type="hidden" name="listingId" value={listingId} />
      <div>
        <Label htmlFor="startsAt">Preferred slot</Label>
        <Input id="startsAt" name="startsAt" type="datetime-local" required />
      </div>
      <div>
        <Label htmlFor="notes">Note</Label>
        <Input id="notes" name="notes" placeholder="Coming from Yaba after 2pm" />
      </div>
      <Button className="w-full" variant="navy" disabled={pending} type="submit">
        {pending ? "Booking…" : "Book a viewing"}
      </Button>
    </form>
  );
}

export function ApplyForm({ listingId }: { listingId: string }) {
  const [state, action, pending] = useActionState(applyToRentAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <input type="hidden" name="listingId" value={listingId} />
      <div>
        <Label htmlFor="note">Cover note</Label>
        <Input id="note" name="note" placeholder="Can pay one year upfront" />
      </div>
      <Button className="w-full" variant="gold" disabled={pending} type="submit">
        {pending ? "Submitting…" : "Apply to rent"}
      </Button>
    </form>
  );
}

export function TicketForm() {
  const [state, action, pending] = useActionState(openTicketAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <SuccessBox message={state.success} />
      <div>
        <Label htmlFor="title">Issue</Label>
        <Input id="title" name="title" required placeholder="Kitchen tap dripping" />
      </div>
      <div>
        <Label htmlFor="detail">Detail</Label>
        <textarea
          id="detail"
          name="detail"
          required
          minLength={8}
          rows={3}
          className="w-full rounded-sm border border-[var(--line)] bg-[var(--panel)] px-3.5 py-3 text-sm outline-none ring-[var(--teal)] focus:ring-2"
        />
      </div>
      <Button disabled={pending} type="submit">
        {pending ? "Opening…" : "Open ticket"}
      </Button>
    </form>
  );
}

export function PayForm({ invoiceId, amount }: { invoiceId: string; amount: string }) {
  const [state, action, pending] = useActionState(payInvoiceAction, {} as FormState);

  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Charging mock wallet…" : `Pay ${amount}`}
      </Button>
      <p className="text-center text-xs text-[var(--muted)]">v1 uses a mock payment provider. No real naira moves.</p>
    </form>
  );
}

export function ListingForm() {
  const [state, action, pending] = useActionState(createListingAction, {} as AgentState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <ErrorBox message={state.error} />
        <SuccessBox message={state.success} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required placeholder="Serviced 2-bed in Yaba" />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="summary">Summary</Label>
        <textarea
          id="summary"
          name="summary"
          required
          minLength={12}
          rows={3}
          className="w-full rounded-sm border border-[var(--line)] bg-[var(--panel)] px-3.5 py-3 text-sm outline-none ring-[var(--teal)] focus:ring-2"
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Select id="city" name="city" required defaultValue="Lagos">
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="area">Area</Label>
        <Input id="area" name="area" required placeholder="Lekki Phase 1" />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" required placeholder="Admiralty Way" />
      </div>
      <div>
        <Label htmlFor="kind">Offer</Label>
        <Select id="kind" name="kind" defaultValue="RENT">
          <option value="RENT">To let</option>
          <option value="SALE">For sale</option>
          <option value="LAND">Land</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select id="type" name="type" defaultValue="FLAT">
          <option value="FLAT">Flat</option>
          <option value="DUPLEX">Duplex</option>
          <option value="BUNGALOW">Bungalow</option>
          <option value="TERRACE">Terrace</option>
          <option value="LAND">Plot</option>
          <option value="SHOP">Shop</option>
          <option value="OFFICE">Office</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="beds">Beds</Label>
        <Input id="beds" name="beds" type="number" min={0} defaultValue={2} />
      </div>
      <div>
        <Label htmlFor="baths">Baths</Label>
        <Input id="baths" name="baths" type="number" min={0} defaultValue={2} />
      </div>
      <div>
        <Label htmlFor="toilets">Toilets</Label>
        <Input id="toilets" name="toilets" type="number" min={0} defaultValue={2} />
      </div>
      <div>
        <Label htmlFor="sqm">Sqm</Label>
        <Input id="sqm" name="sqm" type="number" min={0} placeholder="95" />
      </div>
      <div>
        <Label htmlFor="priceNaira">Price (₦)</Label>
        <Input id="priceNaira" name="priceNaira" type="number" min={1} required placeholder="2400000" />
      </div>
      <div>
        <Label htmlFor="serviceNaira">Service charge (₦)</Label>
        <Input id="serviceNaira" name="serviceNaira" type="number" min={0} defaultValue={0} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="amenities">Amenities (comma separated)</Label>
        <Input id="amenities" name="amenities" placeholder="Inverter, Borehole, Security" />
      </div>
      <div>
        <Label htmlFor="ownerEmail">Landlord email (optional)</Label>
        <Input id="ownerEmail" name="ownerEmail" type="email" placeholder="chinedu@estateng.ng" />
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="furnished" className="h-4 w-4" />
          Furnished
        </label>
      </div>
      <div className="md:col-span-2">
        <Button disabled={pending} type="submit">
          {pending ? "Publishing…" : "Publish listing"}
        </Button>
      </div>
    </form>
  );
}

export function AgencyForm() {
  const [state, action, pending] = useActionState(createAgencyAction, {} as AdminState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-3">
        <ErrorBox message={state.error} />
        <SuccessBox message={state.success} />
      </div>
      <div>
        <Label htmlFor="name">Agency</Label>
        <Input id="name" name="name" required placeholder="Iroko Homes" />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required placeholder="Lagos" />
      </div>
      <div>
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" required placeholder="PPT" />
      </div>
      <div className="md:col-span-3">
        <Button disabled={pending} type="submit">
          {pending ? "Saving…" : "Add agency"}
        </Button>
      </div>
    </form>
  );
}

export function StaffForm({ agencies }: { agencies: { id: string; name: string; code: string }[] }) {
  const [state, action, pending] = useActionState(createStaffAction, {} as AdminState);

  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <ErrorBox message={state.error} />
        <SuccessBox message={state.success} />
      </div>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Adaeze Okonkwo" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" />
      </div>
      <div>
        <Label htmlFor="password">Temporary password</Label>
        <Input id="password" name="password" type="password" minLength={8} required />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select id="role" name="role" defaultValue="AGENT">
          <option value="AGENT">Agent</option>
          <option value="OWNER">Landlord</option>
        </Select>
      </div>
      <div>
        <Label htmlFor="licenseNumber">Licence (agents)</Label>
        <Input id="licenseNumber" name="licenseNumber" placeholder="EDO-LS-00000" />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="agencyId">Agency (agents)</Label>
        <Select id="agencyId" name="agencyId">
          <option value="">Select agency</option>
          {agencies.map((agency) => (
            <option key={agency.id} value={agency.id}>
              {agency.code} · {agency.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-2">
        <Button disabled={pending} type="submit">
          {pending ? "Creating…" : "Create account"}
        </Button>
      </div>
    </form>
  );
}
