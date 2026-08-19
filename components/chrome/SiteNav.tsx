import { telHref } from "@/lib/format";

export type NavItem = {
  href: string;
  label: string;
};

type SiteNavProps = {
  businessName: string;
  phone: string;
  items: NavItem[];
};

export function SiteNav({ businessName, phone, items }: SiteNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-3">
        <a href="#top" className="truncate text-sm font-semibold tracking-tight">
          {businessName}
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Sections">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={telHref(phone)}
          className="shrink-0 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Call
        </a>
      </div>
    </header>
  );
}
