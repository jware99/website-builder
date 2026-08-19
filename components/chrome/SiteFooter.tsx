import { telHref } from "@/lib/format";
import type { Contact } from "@/lib/site-config-schema";

type SiteFooterProps = {
  businessName: string;
  contact: Contact;
};

export function SiteFooter({ businessName, contact }: SiteFooterProps) {
  return (
    <footer className="w-full border-t border-line bg-background py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{businessName}</p>
        {contact.address && <p>{contact.address}</p>}
        <p>
          <a href={telHref(contact.phone)} className="hover:underline">
            {contact.phone}
          </a>
        </p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} {businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
