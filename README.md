# Client Site Template

A complete local-business website rendered from a single JSON file. Nothing else
needs to be edited to stand up a new site: point the template at a config and it
produces the page, the metadata, the sitemap, and the structured data.

The config schema is the contract. Anything that generates sites — today a human,
later an automated pipeline — only has to produce a valid `site.config.json`.

## Quick start

```bash
npm install
npm run dev
```

That renders `site.config.json` at the repo root. To render one of the committed
examples instead:

```bash
npm run preview dental   # or: salon, bakery, default
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server using `site.config.json` |
| `npm run preview <name>` | Dev server using `examples/<name>.json` |
| `npm run build` | Production build (statically prerendered) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Unit tests |
| `npm run lint` | ESLint |

## The config contract

`schemaVersion` is checked exactly, so a config written for a newer schema fails
loudly instead of half-rendering. Bump it only for breaking changes; adding an
optional field does not require a bump.

Only two fields are required: **`business.name`** and **`contact.phone`**. Every
other section is optional, and each section of the page hides itself when its
data is absent. That is what makes a partially filled config usable rather than
blocking — see `examples/bakery.json`, which has no gallery and no staff.

| Key | Contents |
| --- | --- |
| `business` | `name` (required), `tagline`, `description`, `industry` |
| `brand` | `primaryColor`, `accentColor`, `logoUrl`, `headingFont` |
| `contact` | `phone` (required), `email`, `address`, `mapQuery`, `hours[]` |
| `services[]` | `name`, `description`, optional `price` |
| `about` | `story`, `staff[]` of `name`, `role`, `photoUrl`, `bio` |
| `booking` | `type` (`phone` \| `link` \| `embed`) and `value` |
| `gallery[]` | `src`, `alt`, optional `caption` |
| `seo` | `title`, `description`, `ogImage` |
| `provenance` | `sourceUrls[]`, `generatedAt`, `reviewedByHuman` |

Objects are strict: an unrecognized key is an error, not silently dropped data.
Colors must be hex, hours must be 24-hour `HH:MM`, and validation failures name
the offending field:

```
site.config.json does not match the site config schema:
  • contact.email — must be an email address
  • brand.primaryColor — must be a hex color such as #1a73e8
```

Days omitted from `contact.hours` are treated as closed. Consecutive days sharing
the same hours are collapsed automatically, so seven entries can render as
"Mon – Fri".

## Branding

`brand.primaryColor`, `accentColor`, and `headingFont` are applied as CSS custom
properties, so changing one hex value reskins the entire site. Omitted values
fall back to the defaults in `app/globals.css`.

## Deployment

The base URL is not part of the config, so the same config can deploy to staging
and production unchanged. Set it in the environment instead:

```bash
NEXT_PUBLIC_SITE_URL=https://theclient.com npm run build
```

**This must be set at build time.** The page is statically prerendered, so
setting it only when starting the server leaves `localhost:3000` baked into the
canonical tag, `og:url`, and the sitemap. See `.env.example`.

## Layout

```
app/                 page, layout, sitemap
components/sections/ one component per section, each self-hiding
components/chrome/   nav and footer
lib/site-config-schema.ts  the contract
lib/config.ts        typed loader with readable errors
lib/format.ts        hours grouping, phone and map helpers
lib/metadata.ts      metadata derived from seo + business
lib/structured-data.ts     LocalBusiness JSON-LD
examples/            dental, salon, bakery configs
```

## Images

`next/image` is configured to accept any HTTPS host, since configs reference
client-owned photos on unpredictable hosts. Local paths resolve against
`public/`. The SVGs under `public/images/` are placeholders and should be
replaced with real photography; note that an SVG `ogImage` will not render on
most social platforms, so production sites need a PNG or JPEG there.
