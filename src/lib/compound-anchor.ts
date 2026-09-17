/**
 * The id of a compound's panel on /products — "/products#aem, #fkm,
 * #silicone …" (sheet 02 §05). One place, so the compound routers on the
 * category and industry pages and the homepage table link the same ids.
 */
const SHORT: Record<string, string> = {
  aem: "aem",
  fkm: "fkm",
  vmq: "silicone",
  silicone: "silicone",
  epdm: "epdm",
  nbr: "nbr",
  cr: "neoprene",
  neoprene: "neoprene",
  sbr: "sbr",
  nr: "natural-rubber",
  "natural rubber": "natural-rubber",
};

export const compoundAnchor = (codeOrName: string): string => {
  const k = codeOrName.trim().toLowerCase();
  return SHORT[k] ?? SHORT[k.replace(/\s*\(.*\)$/, "")] ?? k.replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
};
