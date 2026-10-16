import Script from "next/script";
import { CLARITY_ID, GA_ID } from "@/lib/analytics";
import { ContactClickTracker } from "./ContactClickTracker";
import { ConsentBanner } from "./ConsentBanner";

/** EEA + UK + Switzerland: where analytics waits for consent (GDPR). */
const EEA = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * Consent defaults, run at the top of BOTH inline tags (once, guarded), so
 * they are in place before either tool starts whatever order the scripts
 * load in. Must stay in step with src/lib/consent.ts — same storage key,
 * same region rule. A stored choice wins; otherwise a Europe time zone
 * starts denied and waits for the banner, everywhere else starts granted.
 * Google also applies the EEA/UK/CH default by IP through `region`.
 */
const CONSENT_JS = `if(!window.__margoConsent){(function(){var s=null;try{s=localStorage.getItem('margo-consent')}catch(e){}if(s!=='granted'&&s!=='denied')s=null;var eu=false;try{eu=/^Europe\\//.test(Intl.DateTimeFormat().resolvedOptions().timeZone||'')}catch(e){}var a=s||(eu?'denied':'granted');window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};var d={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};gtag('consent','default',Object.assign({analytics_storage:'denied',region:${JSON.stringify(EEA)},wait_for_update:500},d));gtag('consent','default',Object.assign({analytics_storage:a},d));if(s)gtag('consent','update',{analytics_storage:s});window.__margoConsent=a;})();}`;

/**
 * GA4 + Clarity, loaded after the page is interactive so neither touches
 * LCP. Rendered by the (site) layout only: the Studio and the enquiries
 * desk are never tracked.
 *
 * Page views: GA4's enhanced measurement counts client-side navigations
 * ("page changes based on browser history events", on by default), and
 * Clarity follows the History API itself — no router hook needed.
 */
export function Analytics() {
  if (!GA_ID && !CLARITY_ID) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`${CONSENT_JS}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="clarity" strategy="afterInteractive">
          {`${CONSENT_JS}(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:window.__margoConsent||"denied"});`}
        </Script>
      )}
      <ContactClickTracker />
      <ConsentBanner />
    </>
  );
}
