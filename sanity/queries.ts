import { groq } from "next-sanity";

/**
 * GROQ queries.
 *
 * Each projects exactly the shape the existing templates already expect, so
 * the page components do not change when their content moves. The migration
 * swaps where the data comes from, not what it looks like.
 */

/** One legal page by slug. */
export const legalBySlugQuery = groq`
  *[_type == "legal" && slug.current == $slug][0]{
    "slug": slug.current,
    status,
    "h1": title,
    badge,
    intro,
    lastUpdated,
    seo{
      title,
      description,
      "keywords": select(defined(primaryKeyword) => {
        "primary": primaryKeyword,
        "secondary": coalesce(secondaryKeywords, [])
      })
    },
    sections[]{
      "id": id.current,
      title,
      navLabel,
      "icon": coalesce(icon, "doc"),
      // The union the templates expect: { p } | { h } | { ul } | { note }.
      // Rebuilt here rather than in the component, so the renderer stays
      // unaware that the shape ever came from anywhere else.
      "blocks": blocks[]{
        kind == "ul" => { "ul": items },
        kind == "p"  => { "p": text },
        kind == "h"  => { "h": text },
        kind == "note" => { "note": text }
      }
    }
  }
`;

/** Slugs for generateStaticParams, and for the sitemap once migrated. */
export const legalSlugsQuery = groq`
  *[_type == "legal" && defined(slug.current)].slug.current
`;

/**
 * One product category by slug.
 *
 * Two things happen in the projection that would otherwise have to happen in a
 * component, and both belong here:
 *
 *  · The SPEC TABLE is flattened. Sanity cannot nest an array inside an array,
 *    so a table row is stored as an object holding `cells`. The renderer and
 *    the Zod schema both expect `string[][]`, exactly as the .mdx files
 *    provide, so `rows[].cells` unwraps it and nothing downstream ever learns
 *    the storage shape was different.
 *
 *  · The PARTS GRID is filled in from the document. The block itself holds
 *    only its heading copy; the parts, the category label and the slug are
 *    read from the enclosing document with `^`. Storing them on the block
 *    would mean the same list existed twice — and that list is also the target
 *    of the 301 redirect map, so a divergence would break old inbound links
 *    without anything failing.
 *
 * `_type` and `_key` are projected through deliberately. They are what the
 * renderer dispatches on, and what React keys the list by.
 */
export const productCategoryBySlugQuery = groq`
  *[_type == "productCategory" && slug.current == $slug][0]{
    "slug": slug.current,
    status,
    navLabel,
    h1,
    h1Accent,
    intro,
    hero,
    heroStats,
    heroStatsAlign,
    heroLink,
    heroActions,
    heroBreadcrumb,
    heroEyebrow,
    heroChips,
    anchors,
    faqs,
    confirmWithMargo,
    related,
    service,
    schemaProduct,
    seo{
      title,
      description,
      "keywords": select(defined(primaryKeyword) => {
        "primary": primaryKeyword,
        "secondary": coalesce(secondaryKeywords, [])
      })
    },
    sections[]{
      ...,
      _type == "block.specTable" => { "rows": rows[].cells },
      _type == "block.cardGrid" => {
        "items": items[]{ ..., "image": image{ alt, hotspot, "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height, "lqip": metadata.lqip } } },
        "groupPhoto": groupPhoto{ alt, caption, hotspot, "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height, "lqip": metadata.lqip } }
      },
      _type == "block.partsGrid" => {
        // Uploaded photos: asset dereferenced to URL + intrinsic size + blur.
        "items": items[]{
          ...,
          "image": image{ alt, hotspot, "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height, "lqip": metadata.lqip } }
        },
        "groupPhoto": groupPhoto{ alt, caption, hotspot, "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height, "lqip": metadata.lqip } },
        "parts": ^.anchors,
        "categoryLabel": ^.navLabel,
        "categorySlug": ^.slug.current
      },
      _type == "block.industryFaq" => { "items": ^.faqs }
    }
  }
`;

/** Slugs for generateStaticParams. */
export const productCategorySlugsQuery = groq`
  *[_type == "productCategory" && defined(slug.current)].slug.current
`;

/**
 * One industry page by slug.
 *
 * `faqs` are joined onto the FAQ block from the document with `^`, the same
 * arrangement as the product parts grid: the list is stored once because it
 * feeds both the on-page accordion and the FAQPage structured data, and two
 * copies would eventually disagree.
 */
export const industryBySlugQuery = groq`
  *[_type == "industry" && slug.current == $slug][0]{
    "slug": slug.current,
    status,
    navLabel,
    tier,
    badge,
    // The flat heading, for the structured data. Needed here as well as on the
    // document — a field that is written but not projected is missing as far
    // as validation is concerned, which is how this was wrong twice.
    h1,
    h1Lines,
    h1AccentLines,
    intro,
    hero,
    heroBoost,
    heroChips,
    actions,
    faqs,
    nonClaims,
    schemaService,
    confirmWithMargo,
    related,
    seo{
      title,
      description,
      "keywords": select(defined(primaryKeyword) => {
        "primary": primaryKeyword,
        "secondary": coalesce(secondaryKeywords, [])
      })
    },
    sections[]{
      ...,
      _type == "block.specTable" => { "rows": rows[].cells },
      _type == "block.cardGrid" => {
        "items": items[]{ ..., "image": image{ alt, hotspot, "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height, "lqip": metadata.lqip } } },
        "groupPhoto": groupPhoto{ alt, caption, hotspot, "asset": asset->{ url, "w": metadata.dimensions.width, "h": metadata.dimensions.height, "lqip": metadata.lqip } }
      },
      _type == "block.industryFaq" => { "items": ^.faqs }
    }
  }
`;

/** Slugs for generateStaticParams. */
export const industrySlugsQuery = groq`
  *[_type == "industry" && defined(slug.current)].slug.current
`;

/**
 * One catalogue part by slug.
 *
 * No `sections` — a SKU page is fixed structure, so every field is projected
 * flat, exactly as the .mdx frontmatter provides it.
 *
 * `compoundProperties` is stored as a list of code/values pairs because Sanity
 * has no map type, and is rebuilt into a map in the source layer. Projected
 * here as stored; the reshaping is one place, and it is not this one.
 */
export const skuBySlugQuery = groq`
  *[_type == "sku" && slug.current == $slug][0]{
    "slug": slug.current,
    status,
    category,
    navLabel,
    h1,
    eyebrow,
    intro,
    productCode,
    stockLabel,
    hardness,
    dimensions,
    processType,
    compoundRanking,
    legacyUrl,
    relatedParts,
    qualityChip,
    documentation,
    ctaBody,
    "compoundRouter": select(defined(compoundRouter) => { "columns": compoundRouter.columns, "rows": compoundRouter.rows[].cells }),
    compoundPrompt,
    advantagesHeading,
    gallery,
    "model3dUrl": model3d.asset->url,
    quickSpecs,
    order,
    assurances,
    dimensional,
    specs,
    compounds,
    compoundProperties,
    advantages,
    applications,
    process,
    quality,
    downloads,
    faqs,
    confirmWithMargo,
    related,
    seo{
      title,
      description,
      "keywords": select(defined(primaryKeyword) => {
        "primary": primaryKeyword,
        "secondary": coalesce(secondaryKeywords, [])
      })
    }
  }
`;

/** Slugs for generateStaticParams. */
export const skuSlugsQuery = groq`
  *[_type == "sku" && defined(slug.current)].slug.current
`;

/**
 * One resource guide by slug.
 *
 * `body` is portable text and is projected whole. It is the only rich-text
 * field on the site, and the only content that will be WRITTEN in the CMS
 * rather than moved into it.
 */
export const resourceBySlugQuery = groq`
  *[_type == "resource" && slug.current == $slug][0]{
    "slug": slug.current,
    status,
    navLabel,
    category,
    icon,
    featured,
    featuredBlurb,
    eyebrow,
    standfirst,
    closing,
    // The guide's own date when set; otherwise when the document was first
    // created and last edited in Sanity (T17: every guide carries both).
    "publishedAt": coalesce(publishedAt, string::split(_createdAt, "T")[0]),
    "updatedAt": string::split(_updatedAt, "T")[0],
    readingMinutes,
    h1,
    intro,
    body,
    faqs,
    confirmWithMargo,
    related,
    seo{
      title,
      description,
      "keywords": select(defined(primaryKeyword) => {
        "primary": primaryKeyword,
        "secondary": coalesce(secondaryKeywords, [])
      })
    }
  }
`;

/** Slugs for generateStaticParams. */
export const resourceSlugsQuery = groq`
  *[_type == "resource" && defined(slug.current)].slug.current
`;

/**
 * Every photograph an editor has uploaded to replace a stock image.
 *
 * One query for all of them: there are at most 85, they are tiny, and the site
 * needs the whole map on any page that draws an image. Fetching per-image
 * would mean a request per photograph on every page.
 */
export const imageOverridesQuery = groq`
  *[_type == "imageOverride" && defined(image.asset)]{
    // Decoding the id back into a slot: "__" was a dot on the way in.
    "slot": array::join(string::split(string::split(_id, "imageOverride-")[1], "__"), "."),
    alt,
    "url": image.asset->url,
    "w": image.asset->metadata.dimensions.width,
    "h": image.asset->metadata.dimensions.height,
    "blur": image.asset->metadata.lqip
  }
`;
