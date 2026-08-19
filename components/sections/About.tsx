import Image from "next/image";
import type { About as AboutConfig } from "@/lib/site-config-schema";
import { Section } from "./Section";

type AboutProps = {
  about?: AboutConfig;
  businessName: string;
  tone?: "plain" | "surface";
};

export function About({ about, businessName, tone }: AboutProps) {
  const hasStory = Boolean(about?.story);
  const staff = about?.staff ?? [];
  if (!hasStory && staff.length === 0) return null;

  return (
    <Section
      id="about"
      eyebrow="Who you're dealing with"
      title={`About ${businessName}`}
      tone={tone}
    >
      {about?.story && (
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">{about.story}</p>
      )}

      {staff.length > 0 && (
        <ul className={`grid gap-6 sm:grid-cols-2 ${about?.story ? "mt-12" : ""}`}>
          {staff.map((person) => (
            <li key={person.name} className="flex gap-4">
              {person.photoUrl && (
                <Image
                  src={person.photoUrl}
                  alt={`${person.name}, ${person.role}`}
                  width={96}
                  height={96}
                  className="h-24 w-24 shrink-0 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-base font-semibold">{person.name}</h3>
                <p className="text-sm font-medium text-accent">{person.role}</p>
                {person.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{person.bio}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
