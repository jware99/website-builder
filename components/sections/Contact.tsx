import { mapEmbedSrc, mapSearchHref, telHref } from "@/lib/format";
import type { Contact as ContactConfig } from "@/lib/site-config-schema";
import { Section } from "./Section";

type ContactProps = {
  contact: ContactConfig;
  businessName: string;
  tone?: "plain" | "surface";
};

/** Always renders: `contact.phone` is required. Optional rows self-hide. */
export function Contact({ contact, businessName, tone }: ContactProps) {
  const mapQuery = contact.mapQuery ?? contact.address;

  return (
    <Section id="contact" eyebrow="Get in touch" title="Contact" tone={tone}>
      <div className="grid gap-10 lg:grid-cols-2">
        <dl className="space-y-6">
          <div>
            <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Phone
            </dt>
            <dd className="mt-1 text-lg">
              <a href={telHref(contact.phone)} className="font-medium text-brand hover:underline">
                {contact.phone}
              </a>
            </dd>
          </div>

          {contact.email && (
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-lg">
                <a
                  href={`mailto:${contact.email}`}
                  className="font-medium text-brand hover:underline"
                >
                  {contact.email}
                </a>
              </dd>
            </div>
          )}

          {contact.address && (
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Address
              </dt>
              <dd className="mt-1 text-lg leading-relaxed">{contact.address}</dd>
              {mapQuery && (
                <dd className="mt-2">
                  <a
                    href={mapSearchHref(mapQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Open in Maps
                  </a>
                </dd>
              )}
            </div>
          )}
        </dl>

        {mapQuery && (
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              title={`Map showing the location of ${businessName}`}
              src={mapEmbedSrc(mapQuery)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-72 w-full lg:h-full lg:min-h-72"
            />
          </div>
        )}
      </div>
    </Section>
  );
}
