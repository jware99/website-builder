import { telHref } from "@/lib/format";
import type { Booking } from "@/lib/site-config-schema";

type BookingCtaProps = {
  booking?: Booking;
  businessName: string;
};

export function BookingCta({ booking, businessName }: BookingCtaProps) {
  if (!booking) return null;

  if (booking.type === "embed") {
    return (
      <section id="booking" className="w-full bg-surface py-16 sm:py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h2 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            Book an appointment
          </h2>
          <div className="overflow-hidden rounded-2xl border border-line bg-background">
            <iframe
              title={`Booking form for ${businessName}`}
              src={booking.value}
              loading="lazy"
              className="h-[40rem] w-full"
            />
          </div>
        </div>
      </section>
    );
  }

  const isPhone = booking.type === "phone";
  const href = isPhone ? telHref(booking.value) : booking.value;

  return (
    <section id="booking" className="w-full bg-brand py-16 text-white sm:py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready when you are</h2>
          <p className="mt-2 text-white/80">
            {isPhone
              ? "Give us a call and we'll find you a time."
              : "Pick a time that works for you."}
          </p>
        </div>
        <a
          href={href}
          {...(isPhone ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-white transition-opacity hover:opacity-90"
        >
          {isPhone ? `Call ${booking.value}` : "Book online"}
        </a>
      </div>
    </section>
  );
}
