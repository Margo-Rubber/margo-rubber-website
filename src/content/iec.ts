/**
 * The heading and body over the IEC certificate (IecCertificate in
 * CertBlocks.tsx), the same on /export and /certifications. Kept out of
 * CertBlocks because that module is "use client", and a plain value imported
 * from it into a server page arrives as a client reference, not the object.
 */
export const IEC_SECTION = {
  eyebrow: "EXPORT REGISTRATION",
  heading: "Importer-Exporter Code (IEC)",
  body: "Margo Rubber Product is registered with the Directorate General of Foreign Trade, Government of India. The IEC can be verified on dgft.gov.in under Services › View Any IEC Details.",
};
