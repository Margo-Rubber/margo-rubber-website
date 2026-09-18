import { redirect } from "next/navigation";
import { isConfigured, isSignedIn } from "@/lib/admin/session";
import { LoginForm } from "./LoginForm";

/**
 * The sign-in page is rendered per request, never prerendered.
 *
 * The form posts to a server action, and the HTML carries that action's id.
 * As a static page this segment was built once per deployment and cached, so
 * a login page loaded before a deploy — or served stale after one — carried
 * an id the new deployment no longer knew. The first submit then failed and
 * the framework reloaded the page; only the second submit signed in. Reading
 * the cookie here makes the page dynamic, so every load carries the current
 * deployment's action id and the first attempt is the one that counts.
 *
 * It also means someone already signed in does not see a login form.
 */
export const instant = false;

export const metadata = {
  title: "Sign in · Margo desk",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (isConfigured() && (await isSignedIn())) redirect("/margo-desk");
  return <LoginForm />;
}
