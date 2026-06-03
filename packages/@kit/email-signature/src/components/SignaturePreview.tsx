/**
 * SignaturePreview
 * ================
 * Live preview with auto-height iframes — no fixed height, no scrollbars.
 *
 * Both desktop and mobile iframes are always mounted (CSS show/hide).
 * After each HTML write, a ResizeObserver on the iframe's body measures
 * the actual content height and sets the iframe height to match.
 * This means short signatures show a compact frame and tall signatures
 * (with confidentiality clauses, banners, etc.) expand to fit.
 *
 * Mobile view: the iframe renders at 600px natural width then is scaled
 * down by MOBILE_SCALE. The container height is adjusted to match the
 * scaled height automatically.
 */

import { ShareButton } from '@kit/email-signature/components/ShareButton';
import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { generateFoleyHtml } from '@kit/email-signature/lib/generateFoleyHtml';
import { generateSignatureHtml } from '@kit/email-signature/lib/generateSignatureHtml';
import { generateStorysnapHtml } from '@kit/email-signature/lib/generateStorysnapHtml';
import { generateSquaxeHtml } from '@kit/email-signature/lib/generateSquaxeHtml';
import { generateDozerHtml } from '@kit/email-signature/lib/generateDozerHtml';
import { generateJohnsonHtml } from '@kit/email-signature/lib/generateJohnsonHtml';
import type { SignatureFields } from '@kit/email-signature/contexts/SignatureContext';
import { Info, Monitor, Smartphone } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MOBILE_SCALE = 0.55;
const IFRAME_NATURAL_WIDTH = 600;
const MOBILE_FRAME_WIDTH = 390;

function getHtml(fields: SignatureFields): string {
  if (fields.activeTemplate === 'the-johnson') {
    return generateJohnsonHtml({
      fullName: fields.fullName, jobTitle: fields.jobTitle, department: fields.department,
      companyName: fields.companyName, email: fields.email, phone: fields.phone,
      website: fields.website, streetAddress: fields.streetAddress,
      photoUrl: fields.photoUrl, logoUrl: fields.logoUrl, brandColor: fields.brandColor,
      linkedinUrl: fields.linkedinUrl, instagramUrl: fields.instagramUrl,
      twitterUrl: fields.twitterUrl, youtubeUrl: fields.youtubeUrl, facebookUrl: fields.facebookUrl,
      confidentialityEnabled: fields.confidentialityEnabled, confidentialityText: fields.confidentialityText,
      trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource,
      utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign, utmContent: fields.utmContent,
    });
  }
  if (fields.activeTemplate === 'the-dozer') {
    return generateDozerHtml({
      fullName: fields.fullName, jobTitle: fields.jobTitle,
      cellPhone: fields.cellPhone, officePhone: fields.officePhone,
      email: fields.email, website: fields.website,
      promoText: fields.promoText, promoLinkText: fields.promoLinkText,
      promoLinkUrl: fields.promoLinkUrl, logoUrl: fields.logoUrl,
      brandColor: fields.brandColor, linkedinUrl: fields.linkedinUrl,
      instagramUrl: fields.instagramUrl,
      twitterUrl: fields.twitterUrl,
      facebookUrl: fields.facebookUrl,
      confidentialityEnabled: fields.confidentialityEnabled,
      confidentialityText: fields.confidentialityText,
      trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource,
      utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign,
      utmContent: fields.utmContent,
    });
  }
  if (fields.activeTemplate === 'the-squaxe') {
    return generateSquaxeHtml({
      fullName: fields.fullName, jobTitle: fields.jobTitle,
      email: fields.email, phone: fields.phone, website: fields.website,
      streetAddress: fields.streetAddress, photoUrl: fields.photoUrl,
      logoUrl: fields.logoUrl, bannerUrl: fields.bannerUrl,
      linkedinUrl: fields.linkedinUrl, twitterUrl: fields.twitterUrl,
      facebookUrl: fields.facebookUrl, instagramUrl: fields.instagramUrl,
      youtubeUrl: fields.youtubeUrl,
      confidentialityEnabled: fields.confidentialityEnabled,
      confidentialityText: fields.confidentialityText,
      trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource,
      utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign,
      utmContent: fields.utmContent,
    });
  }
  if (fields.activeTemplate === 'the-storysnap') {
    return generateStorysnapHtml({
      fullName: fields.fullName, jobTitle: fields.jobTitle,
      companyName: fields.companyName, brandsLine: fields.brandsLine,
      ctaText: fields.ctaText, ctaUrl: fields.ctaUrl,
      email: fields.email, website: fields.website,
      logoUrl: fields.logoUrl, brandColor: fields.brandColor,
      confidentialityEnabled: fields.confidentialityEnabled,
      confidentialityText: fields.confidentialityText,
      trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource,
      utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign,
      utmContent: fields.utmContent,
    });
  }
  if (fields.activeTemplate === 'the-foley') {
    return generateFoleyHtml({
      fullName: fields.fullName, jobTitle: fields.jobTitle,
      companyName: fields.companyName, companyUrl: fields.companyUrl,
      streetAddress: fields.streetAddress, phone: fields.phone,
      email: fields.email, bioUrl: fields.bioUrl,
      linkedinUrl: fields.linkedinUrl, logoUrl: fields.logoUrl,
      brandColor: fields.brandColor,
      confidentialityEnabled: fields.confidentialityEnabled,
      confidentialityText: fields.confidentialityText,
      trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource,
      utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign,
      utmContent: fields.utmContent,
    });
  }
  return generateSignatureHtml(fields);
}

// ── Auto-height iframe hook ───────────────────────────────────────────────────
// Writes HTML to the iframe and measures the body's scrollHeight,
// then sets the iframe height to eliminate all internal scrollbars.

function useAutoHeightIframe(html: string) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(200);

  const measure = useCallback(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const body = iframe.contentDocument?.body;
    if (!body) return;
    const h = body.scrollHeight;
    if (h > 0) setHeight(h);
  }, []);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    // Measure after a short paint delay
    const t1 = setTimeout(measure, 80);
    const t2 = setTimeout(measure, 300); // second pass for images/fonts
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [html, measure]);

  return { ref, height };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SignaturePreview() {
  const { fields } = useSignature();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const html = getHtml(fields);

  const desktop = useAutoHeightIframe(html);
  const mobile = useAutoHeightIframe(html);

  // Scaled height for mobile container
  const mobileContainerHeight = mobile.height * MOBILE_SCALE;

  return (
    <div className="preview-bg flex flex-col flex-1 min-w-0 h-full">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#e5e7eb] bg-white shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a1a] tracking-tight">Live Preview</h2>
          <p className="text-[11px] text-[#888888] font-mono mt-0.5">Updates in real time as you edit fields</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          <div className="w-px h-5 bg-[#e5e7eb]" />
          <div className="flex items-center gap-1 bg-[#f4f4f4] rounded-md p-0.5 border border-[#e5e7eb]">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px] font-medium transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[#111111] border border-[#e5e7eb]' : 'text-[#888888] hover:text-[#555555]'}`}
            >
              <Monitor size={13} />Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px] font-medium transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[#111111] border border-[#e5e7eb]' : 'text-[#888888] hover:text-[#555555]'}`}
            >
              <Smartphone size={13} />Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Preview area — scrollable outer, but iframes themselves don't scroll */}
      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">

        {/* ── DESKTOP VIEW ── */}
        <div className="w-full max-w-3xl" style={{ display: viewMode === 'desktop' ? 'block' : 'none' }}>
          {/* Email chrome top */}
          <div className="bg-[#efefef] rounded-t-lg border border-[#e5e7eb] px-4 py-2.5 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 bg-white rounded text-[11px] text-[#888888] px-3 py-1 font-mono border border-[#e5e7eb]">
              Re: Following up — {fields.fullName || 'Your Name'}
            </div>
          </div>

          {/* Email body */}
          <div className="bg-white border-x border-[#e5e7eb] px-6 py-5">
            <div className="text-[13px] text-[#444444] mb-6 leading-relaxed">
              <p className="mb-2">Hi there,</p>
              <p className="mb-2">Thanks for reaching out — I'd love to connect and learn more about your needs.</p>
              <p>Best,</p>
            </div>
            {/* Auto-height signature iframe */}
            <div className="preview-paper rounded overflow-hidden">
              <iframe
                ref={desktop.ref}
                title="Desktop Preview"
                className="w-full border-0 block"
                style={{ height: `${desktop.height}px` }}
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          {/* Email chrome bottom */}
          <div className="bg-[#efefef] rounded-b-lg border border-t-0 border-[#e5e7eb] px-4 py-2">
            <div className="text-[10px] text-[#aaaaaa] font-mono">Reply · Forward · Archive</div>
          </div>

          {/* Drop shadow note */}
          <div className="mt-3 flex items-start gap-1.5 px-1">
            <Info size={12} className="mt-0.5 shrink-0 icon-muted" />
            <p className="text-[11px] text-[#888888] leading-relaxed">
              <strong className="text-[#555555]">Note:</strong> The drop shadow shown on the preview card is for visual representation only and will not be included in the actual email signature.
            </p>
          </div>
        </div>

        {/* ── MOBILE VIEW ── */}
        <div style={{ display: viewMode === 'mobile' ? 'block' : 'none', width: `${MOBILE_FRAME_WIDTH}px` }}>
          {/* Phone shell — overflow:hidden clips content to rounded corners */}
          <div
            className="rounded-[2.5rem] border-[6px] border-[#cccccc] bg-white overflow-hidden shadow-md"
            style={{ width: `${MOBILE_FRAME_WIDTH}px` }}
          >
            {/* Status bar */}
            <div className="bg-white px-6 pt-3 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#1a1a1a]">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-1.5 rounded-sm bg-[#1a1a1a] opacity-60" />
                <div className="w-1 h-1 rounded-full bg-[#1a1a1a] opacity-60" />
                <div className="w-3.5 h-1.5 rounded-sm bg-[#1a1a1a] opacity-60" />
              </div>
            </div>

            {/* Email chrome */}
            <div className="bg-[#f4f4f4] border-t border-b border-[#e0e0e0] px-3 py-1.5">
              <p className="text-[10px] text-[#888888] font-mono truncate">
                Re: Following up — {fields.fullName || 'Your Name'}
              </p>
            </div>

            {/* Email body */}
            <div className="bg-white px-4 py-3">
              <p className="text-[10px] text-[#444444] mb-3 leading-relaxed">
                Hi there, thanks for reaching out.<br />Best,
              </p>

              {/*
                The iframe renders at IFRAME_NATURAL_WIDTH (600px) and is
                scaled down by MOBILE_SCALE. The wrapper clips to the scaled
                height so there's no empty space below.
              */}
              {/*
                Container height = scaled iframe height, clamped 500-900px.
                The iframe itself is set to the SAME unscaled height so the
                browser never adds a scrollbar inside it.
              */}
              <div
                style={{
                  width: `${IFRAME_NATURAL_WIDTH * MOBILE_SCALE}px`,
                  height: `${Math.min(Math.max(mobileContainerHeight, 500), 900)}px`,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <iframe
                  ref={mobile.ref}
                  title="Mobile Preview"
                  style={{
                    width: `${IFRAME_NATURAL_WIDTH}px`,
                    /* Height = container height / MOBILE_SCALE so iframe fills
                       the container exactly — no internal scroll, no clipping */
                    height: `${Math.min(Math.max(mobileContainerHeight, 500), 900) / MOBILE_SCALE}px`,
                    border: 'none',
                    display: 'block',
                    transformOrigin: 'top left',
                    transform: `scale(${MOBILE_SCALE})`,
                  }}
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Home bar */}
            <div className="bg-white px-6 py-3 flex justify-center">
              <div className="w-24 h-1 rounded-full bg-[#cccccc]" />
            </div>
          </div>

          {/* Mobile disclaimer */}
          <div className="mt-3 flex items-start gap-1.5 px-1">
            <Info size={12} className="mt-0.5 shrink-0 icon-muted" />
            <p className="text-[11px] text-[#888888] leading-relaxed">
              <strong className="text-[#555555]">Mobile preview</strong> is scaled to ~55% to represent retina rendering. The actual signature renders correctly on device.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="px-6 py-3 border-t border-[#e5e7eb] bg-white shrink-0">
        <p className="text-[11px] text-[#888888]">
          Compatible with <strong className="text-[#555555]">Gmail</strong>, <strong className="text-[#555555]">Outlook 2016/2019/365</strong>, <strong className="text-[#555555]">Apple Mail</strong>, and <strong className="text-[#555555]">HubSpot</strong>.
        </p>
      </div>
    </div>
  );
}
