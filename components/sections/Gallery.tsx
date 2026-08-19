import Image from "next/image";
import type { GalleryImage } from "@/lib/site-config-schema";
import { Section } from "./Section";

type GalleryProps = {
  images?: GalleryImage[];
  tone?: "plain" | "surface";
};

export function Gallery({ images, tone }: GalleryProps) {
  if (!images?.length) return null;

  return (
    <Section id="gallery" eyebrow="A look around" title="Gallery" tone={tone}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <li key={image.src} className="overflow-hidden rounded-2xl border border-line">
            <div className="relative aspect-[4/3] bg-surface">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            {image.caption && (
              <p className="border-t border-line px-4 py-3 text-sm text-muted-foreground">
                {image.caption}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
