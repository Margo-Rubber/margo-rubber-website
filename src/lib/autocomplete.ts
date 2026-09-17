/**
 * The browser's autofill hint for a form field, from the field's name —
 * "autocomplete on name / organization / email" (sheets 04 and 05). One
 * map for every form, so a field renamed in content still autofills.
 */
const HINTS: Record<string, string> = {
  fullName: "name",
  name: "name",
  company: "organization",
  organisation: "organization",
  email: "email",
  phone: "tel",
  country: "country-name",
};

export const autocompleteFor = (field: string): string | undefined => HINTS[field];
