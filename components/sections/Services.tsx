import type { Service } from "@/lib/site-config-schema";
import { Section } from "./Section";

type ServicesProps = {
  services?: Service[];
  tone?: "plain" | "surface";
};

export function Services({ services, tone }: ServicesProps) {
  if (!services?.length) return null;

  return (
    <Section id="services" eyebrow="What we do" title="Services" tone={tone}>
      <ul className="grid gap-5 sm:grid-cols-2">
        {services.map((service) => (
          <li
            key={service.name}
            className="flex flex-col rounded-2xl border border-line bg-background p-6"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              {service.price && (
                <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-sm font-medium text-brand">
                  {service.price}
                </span>
              )}
            </div>
            <p className="mt-3 text-muted-foreground">{service.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
