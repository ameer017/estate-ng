import { AlertCircle, Inbox } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[var(--line)] bg-[var(--panel)] px-6 py-16 text-center">
      <Inbox className="mb-3 h-10 w-10 text-[var(--teal)]" />
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{body}</p>
    </div>
  );
}

export function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-start gap-2 border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}

export function SuccessBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
      {message}
    </div>
  );
}
