import SiteLayout from "./(site)/layout";
import NotFoundPage from "./(site)/not-found";

/**
 * 404 for paths outside every route group.
 *
 * The designed page sits in (site)/not-found.tsx and answers for unknown
 * paths inside a known section — /products/nope, /industries/nope. A path
 * that matches no segment at all (/jdhfk) never enters the group, and Next
 * then falls back to its built-in "This page could not be found", rendered
 * in the bare root layout: white, no header, no way onward. This file is
 * the root's own not-found, and it renders the same page inside the same
 * chrome so the two are indistinguishable.
 */
export default function RootNotFound() {
  return (
    <SiteLayout>
      <NotFoundPage />
    </SiteLayout>
  );
}
