import Script from "next/script";
import { CLARITY_ID, GA_ID, META_PIXEL_ID } from "@/lib/analytics";
import { CONSENT_TIME_ZONE } from "@/lib/consent-region";
import { ContactClickTracker } from "./ContactClickTracker";
import { ConsentBanner } from "./ConsentBanner";
import { MetaPageView } from "./MetaPageView";

/** EEA + UK + Switzerland: where analytics waits for consent (GDPR). */
const EEA = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * Consent defaults, run at the top of BOTH inline tags (once, guarded), so
 * they are in place before either tool starts whatever order the scripts
 * load in. Must stay in step with src/lib/consent.ts — same storage key; the
 * region rule is shared (src/lib/consent-region.ts). A stored choice wins;
 * otherwise a consent-region time zone starts denied and waits for the
 * banner, everywhere else starts granted. Google also applies the EEA/UK/CH
 * default by IP through `region`.
 */
const CONSENT_JS = `if(!window.__margoConsent){(function(){var s=null;try{s=localStorage.getItem('margo-consent')}catch(e){}if(s!=='granted'&&s!=='denied')s=null;var eu=false;try{eu=new RegExp(${JSON.stringify(CONSENT_TIME_ZONE.source)}).test(Intl.DateTimeFormat().resolvedOptions().timeZone||'')}catch(e){}var a=s||(eu?'denied':'granted');window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};var d={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};gtag('consent','default',Object.assign({analytics_storage:'denied',region:${JSON.stringify(EEA)},wait_for_update:500},d));gtag('consent','default',Object.assign({analytics_storage:a},d));if(s)gtag('consent','update',{analytics_storage:s});window.__margoConsent=a;})();}`;

/**
 * Holds back the three vendors' files until the visitor first scrolls, taps or
 * presses a key, or 5 seconds after load if they do none of those. Between them
 * those files were most of the long tasks on a phone (Lighthouse, 5 Nov 2026).
 * The stubs still run straight away, so anything sent early waits in a queue
 * and nothing is lost. A visitor who leaves inside 5 seconds without touching
 * the page is not counted.
 */
const DEFER_JS = `if(!window.__margoDefer){(function(){var q=[],done=false,ev=['pointerdown','keydown','scroll','touchstart'],o={passive:true,capture:true};function run(){if(done)return;done=true;ev.forEach(function(e){removeEventListener(e,run,o)});var f;while(f=q.shift())f()}ev.forEach(function(e){addEventListener(e,run,o)});setTimeout(run,5000);window.__margoDefer=function(f){done?f():q.push(f)}})();}`;

/**
 * The Meta Pixel, installed only once analytics consent is granted (D1):
 * straight away where consent starts granted, otherwise from the cookie
 * banner's Accept (src/lib/consent.ts calls window.__margoLoadMeta). Until
 * then fbevents.js is not even downloaded, so a visitor in the EEA, UK or
 * Switzerland who has not accepted sends Meta nothing — the same rule
 * Google Consent Mode applies to GA4.
 */
const metaLoader = (id: string) =>
  `window.__margoLoadMeta=function(){if(window.fbq)return;!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;window.__margoDefer(function(){s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)})}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','${id}');fbq('track','PageView');};if(window.__margoConsent==='granted')window.__margoLoadMeta();`;

/**
 * The stubs for GA4, the Meta Pixel and Clarity run with `lazyOnload`, after
 * the page has fully loaded, and DEFER_JS holds their files back further, so
 * none competes with the headline for the network or the main thread (D2: GA4
 * and Meta added ~460 KB before first paint). A Clarity recording starts at the
 * first scroll or tap, or at 5 seconds. Rendered by the (site) layout only: the
 * Studio and the enquiries desk are never tracked.
 *
 * Page views: GA4's enhanced measurement counts client-side navigations
 * ("page changes based on browser history events", on by default), and
 * Clarity follows the History API itself — no router hook needed. Meta
 * does not, so MetaPageView sends its PageView on route changes.
 */
export function Analytics() {
  if (!GA_ID && !CLARITY_ID && !META_PIXEL_ID) return null;

  return (
    <>
      {GA_ID && (
        <Script id="ga4" strategy="lazyOnload">
          {`${CONSENT_JS}${DEFER_JS}gtag('js',new Date());gtag('config','${GA_ID}');window.__margoDefer(function(){var t=document.createElement('script');t.async=1;t.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(t)});`}
        </Script>
      )}
      {CLARITY_ID && (
        // NOT id="clarity": an element id becomes a window property, so
        // window.clarity was this <script> element and Clarity never started
        // (D1). Any id that is not a global the tag uses is safe.
        <Script id="ms-clarity" strategy="lazyOnload">
          {`${CONSENT_JS}${DEFER_JS}(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;c.__margoDefer(function(){y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)});})(window,document,"clarity","script","${CLARITY_ID}");window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:window.__margoConsent||"denied"});`}
        </Script>
      )}
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="lazyOnload">
            {`${CONSENT_JS}${DEFER_JS}${metaLoader(META_PIXEL_ID)}`}
          </Script>
          <MetaPageView />
        </>
      )}
      <ContactClickTracker />
      <ConsentBanner />
    </>
  );
}
