import type { SchemaTypeDefinition } from "sanity";
import { legal } from "./legal.ts";
import { productCategory } from "./documents/productCategory.ts";
import { industry } from "./documents/industry.ts";
import { sku } from "./documents/sku.ts";
import { resource } from "./documents/resource.ts";
import { SIMPLE_MARKETING_TYPES } from "./documents/marketing-simple.ts";
import { MEDIUM_MARKETING_TYPES } from "./documents/marketing-medium.ts";
import { productsHub } from "./documents/products-hub.ts";
import { homePage } from "./documents/home.ts";
import { LARGE_MARKETING_TYPES } from "./documents/about-why.ts";
import { imageOverride } from "./documents/imageOverride.ts";
import { siteSettings } from "./documents/settings.ts";
import { legalBlock, legalSection, seo } from "./objects.ts";
import { UNIVERSAL_BLOCKS } from "./blocks/universal.ts";
import { PRODUCT_BLOCKS } from "./blocks/product.ts";
import { INDUSTRY_BLOCKS } from "./blocks/industry.ts";

/**
 * The content model.
 *
 * Documents, then the block library, then the shared objects the two draw on.
 *
 * Blocks are named `block.*` so that a page type's array of allowed blocks is
 * readable at a glance, and so nothing in the list can collide with a document
 * type. They are registered globally here but ALLOW-LISTED per page type: a
 * category page offers the compound selector, the homepage does not. That
 * restriction lives on the document, not here — a block being registered means
 * it exists, not that it is offered everywhere.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  siteSettings,
  legal,
  productCategory,
  industry,
  sku,
  resource,
  ...SIMPLE_MARKETING_TYPES,
  ...MEDIUM_MARKETING_TYPES,
  productsHub,
  homePage,
  ...LARGE_MARKETING_TYPES,
  imageOverride,

  // Block library
  ...UNIVERSAL_BLOCKS,
  ...PRODUCT_BLOCKS,
  ...INDUSTRY_BLOCKS,

  // Shared objects
  seo,
  legalSection,
  legalBlock,
];

/**
 * Block names, for building a document type's allow-list without retyping
 * strings that would silently stop matching if a block were renamed.
 */
export const UNIVERSAL_BLOCK_NAMES = UNIVERSAL_BLOCKS.map((b) => b.name);
export const PRODUCT_BLOCK_NAMES = PRODUCT_BLOCKS.map((b) => b.name);
export const INDUSTRY_BLOCK_NAMES = INDUSTRY_BLOCKS.map((b) => b.name);
