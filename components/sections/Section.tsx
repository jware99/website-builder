import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  eyebrow?: string;
  intro?: string;
  tone?: "plain" | "surface";
  children: ReactNode;
};

export function Section({
  id,
  title,
  eyebrow,
  intro,
  tone = "plain",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`w-full py-16 sm:py-24 ${tone === "surface" ? "bg-surface" : "bg-background"}`}
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        {(eyebrow || title || intro) && (
          <header className="mb-10 max-w-2xl">
            {eyebrow && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            )}
            {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
