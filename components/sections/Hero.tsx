import Image from "next/image";
import { telHref } from "@/lib/format";
import type { Brand, Business } from "@/lib/site-config-schema";

type HeroProps = {
  business: Business;
  brand?: Brand;
  phone: string;
};

/** Always renders: `business.name` and `contact.phone` are the two required fields. */
export function Hero({ business, brand, phone }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden bg-brand text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-black/10"
      />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        {brand?.logoUrl && (
          <div className="mb-8 inline-flex rounded-xl bg-white p-3 shadow-sm">
            <Image
              src={brand.logoUrl}
              alt={`${business.name} logo`}
              width={200}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>
        )}

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {business.name}
        </h1>

        {business.tagline && (
          <p className="mt-5 max-w-2xl text-xl text-white/90 sm:text-2xl">{business.tagline}</p>
        )}

        {business.description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75">
            {business.description}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={telHref(phone)}
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Call {phone}
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-base font-medium text-white transition-colors hover:bg-white/10"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
