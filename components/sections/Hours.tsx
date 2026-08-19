import { formatHourRange, groupHours } from "@/lib/format";
import type { HoursEntry } from "@/lib/site-config-schema";
import { Section } from "./Section";

type HoursProps = {
  hours?: HoursEntry[];
  tone?: "plain" | "surface";
};

export function Hours({ hours, tone }: HoursProps) {
  if (!hours?.length) return null;
  const groups = groupHours(hours);

  return (
    <Section id="hours" eyebrow="When we're open" title="Hours" tone={tone}>
      <dl className="max-w-xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-background">
        {groups.map((group) => (
          <div
            key={group.days.join("-")}
            className="flex items-center justify-between gap-6 px-6 py-4"
          >
            <dt className="font-medium">{group.label}</dt>
            <dd className="text-muted-foreground">{formatHourRange(group)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-muted-foreground">Closed on days not listed.</p>
    </Section>
  );
}
