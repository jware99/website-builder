import { z } from "zod";

/**
 * Bump when a change would break a config a generator already produced.
 * Additive optional fields do not require a bump.
 */
export const SCHEMA_VERSION = 1;

const hexColor = z
  .string()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "must be a hex color such as #1a73e8");

const timeOfDay = z
  .string()
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "must be a 24-hour time such as 09:00");

/** Either an absolute URL or a path under `public/`. */
const imageRef = z.string().min(1, "must not be empty");

export const dayOfWeekSchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const businessSchema = z
  .object({
    name: z.string().min(1, "must not be empty"),
    tagline: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    industry: z.string().min(1).optional(),
  })
  .strict();

export const brandSchema = z
  .object({
    primaryColor: hexColor.optional(),
    accentColor: hexColor.optional(),
    logoUrl: imageRef.optional(),
    headingFont: z.string().min(1).optional(),
  })
  .strict();

export const hoursEntrySchema = z
  .object({
    day: dayOfWeekSchema,
    open: timeOfDay,
    close: timeOfDay,
  })
  .strict();

export const contactSchema = z
  .object({
    phone: z.string().min(1, "must not be empty"),
    email: z.email("must be an email address").optional(),
    address: z.string().min(1).optional(),
    mapQuery: z.string().min(1).optional(),
    hours: z.array(hoursEntrySchema).min(1, "must list at least one day").optional(),
  })
  .strict();

export const serviceSchema = z
  .object({
    name: z.string().min(1, "must not be empty"),
    description: z.string().min(1, "must not be empty"),
    price: z.string().min(1).optional(),
  })
  .strict();

export const staffMemberSchema = z
  .object({
    name: z.string().min(1, "must not be empty"),
    role: z.string().min(1, "must not be empty"),
    photoUrl: imageRef.optional(),
    bio: z.string().min(1).optional(),
  })
  .strict();

export const aboutSchema = z
  .object({
    story: z.string().min(1).optional(),
    staff: z.array(staffMemberSchema).min(1, "must list at least one person").optional(),
  })
  .strict();

export const bookingSchema = z
  .object({
    type: z.enum(["phone", "link", "embed"]),
    value: z.string().min(1, "must not be empty"),
  })
  .strict();

export const galleryImageSchema = z
  .object({
    src: imageRef,
    alt: z.string().min(1, "must not be empty"),
    caption: z.string().min(1).optional(),
  })
  .strict();

export const seoSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    ogImage: imageRef.optional(),
  })
  .strict();

export const provenanceSchema = z
  .object({
    sourceUrls: z.array(z.url("must be a URL")).optional(),
    generatedAt: z.iso.datetime("must be an ISO 8601 timestamp").optional(),
    reviewedByHuman: z.boolean().optional(),
  })
  .strict();

/**
 * The contract between this template and whatever fills it in. Only
 * `business.name` and `contact.phone` are required; every other section is
 * optional so a partially filled config still renders a coherent site.
 */
export const siteConfigSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    business: businessSchema,
    contact: contactSchema,
    brand: brandSchema.optional(),
    services: z.array(serviceSchema).min(1, "must list at least one service").optional(),
    about: aboutSchema.optional(),
    booking: bookingSchema.optional(),
    gallery: z.array(galleryImageSchema).min(1, "must list at least one image").optional(),
    seo: seoSchema.optional(),
    provenance: provenanceSchema.optional(),
  })
  .strict();

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type Business = z.infer<typeof businessSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type HoursEntry = z.infer<typeof hoursEntrySchema>;
export type Service = z.infer<typeof serviceSchema>;
export type About = z.infer<typeof aboutSchema>;
export type StaffMember = z.infer<typeof staffMemberSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type Seo = z.infer<typeof seoSchema>;
export type Provenance = z.infer<typeof provenanceSchema>;
export type DayOfWeek = z.infer<typeof dayOfWeekSchema>;
