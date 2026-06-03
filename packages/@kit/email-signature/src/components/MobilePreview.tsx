/**
 * MobilePreview
 * =============
 * Mobile-only Preview tab (used on small screens).
 * Auto-height iframe — expands to full signature content, no scroll.
 * The phone shell grows with the content so tall templates like The Dozer
 * show completely without any internal scrollbar.
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
import { Info } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MOBILE_SCALE = 0.55;
const IFRAME_NATURAL_WIDTH = 600;

function getHtml(fields: SignatureFields): string {
  if (fields.activeTemplate === 'the-johnson') {
    return generateJohnsonHtml({ fullName: fields.fullName, jobTitle: fields.jobTitle, department: fields.department, companyName: fields.companyName, email: fields.email, phone: fields.phone, website: fields.website, streetAddress: fields.streetAddress, photoUrl: fields.photoUrl, logoUrl: fields.logoUrl, brandColor: fields.brandColor, linkedinUrl: fields.linkedinUrl, instagramUrl: fields.instagramUrl, twitterUrl: fields.twitterUrl, youtubeUrl: fields.youtubeUrl, facebookUrl: fields.facebookUrl, confidentialityEnabled: fields.confidentialityEnabled, confidentialityText: fields.confidentialityText, trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource, utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign, utmContent: fields.utmContent });
  }
  if (fields.activeTemplate === 'the-dozer') {
    return generateDozerHtml({ fullName: fields.fullName, jobTitle: fields.jobTitle, cellPhone: fields.cellPhone, officePhone: fields.officePhone, email: fields.email, website: fields.website, promoText: fields.promoText, promoLinkText: fields.promoLinkText, promoLinkUrl: fields.promoLinkUrl, logoUrl: fields.logoUrl, brandColor: fields.brandColor, linkedinUrl: fields.linkedinUrl, instagramUrl: fields.instagramUrl, twitterUrl: fields.twitterUrl, facebookUrl: fields.facebookUrl, confidentialityEnabled: fields.confidentialityEnabled, confidentialityText: fields.confidentialityText, trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource, utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign, utmContent: fields.utmContent });
  }
  if (fields.activeTemplate === 'the-squaxe') {
    return generateSquaxeHtml({ fullName: fields.fullName, jobTitle: fields.jobTitle, email: fields.email, phone: fields.phone, website: fields.website, streetAddress: fields.streetAddress, photoUrl: fields.photoUrl, logoUrl: fields.logoUrl, bannerUrl: fields.bannerUrl, linkedinUrl: fields.linkedinUrl, twitterUrl: fields.twitterUrl, facebookUrl: fields.facebookUrl, instagramUrl: fields.instagramUrl, youtubeUrl: fields.youtubeUrl, confidentialityEnabled: fields.confidentialityEnabled, confidentialityText: fields.confidentialityText, trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource, utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign, utmContent: fields.utmContent });
  }
  if (fields.activeTemplate === 'the-storysnap') {
    return generateStorysnapHtml({ fullName: fields.fullName, jobTitle: fields.jobTitle, companyName: fields.companyName, brandsLine: fields.brandsLine, ctaText: fields.ctaText, ctaUrl: fields.ctaUrl, email: fields.email, website: fields.website, logoUrl: fields.logoUrl, brandColor: fields.brandColor, confidentialityEnabled: fields.confidentialityEnabled, confidentialityText: fields.confidentialityText, trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource, utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign, utmContent: fields.utmContent });
  }
  if (fields.activeTemplate === 'the-foley') {
    return generateFoleyHtml({ fullName: fields.fullName, jobTitle: fields.jobTitle, companyName: fields.companyName, companyUrl: fields.companyUrl, streetAddress: fields.streetAddress, phone: fields.phone, email: fields.email, bioUrl: fields.bioUrl, linkedinUrl: fields.linkedinUrl, logoUrl: fields.logoUrl, brandColor: fields.brandColor, confidentialityEnabled: fields.confidentialityEnabled, confidentialityText: fields.confidentialityText, trackingEnabled: fields.trackingEnabled, utmSource: fields.utmSource, utmMedium: fields.utmMedium, utmCampaign: fields.utmCampaign, utmContent: fields.utmContent });
  }
  return generateSignatureHtml(fields);
}

export function MobilePreview() {
  const { fields } = useSignature();
  const html = getHtml(fields);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(200);

  const measure = useCallback(() => {
    const body = iframeRef.current?.contentDocument?.body;
    if (body && body.scrollHeight > 0) setIframeHeight(body.scrollHeight);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    const t1 = setTimeout(measure, 80);
    const t2 = setTimeout(measure, 350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [html, measure]);

  // Container clips to the scaled height so no empty space below
  const containerWidth = IFRAME_NATURAL_WIDTH * MOBILE_SCALE;
  const containerHeight = iframeHeight * MOBILE_SCALE;

  return (
    // Full viewport height minus the header (112px), scrollable so very tall
    // signatures can still be reached by scrolling the outer page
    <div className="preview-bg flex flex-col">

      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#e5e7eb] shrink-0">
        <div>
          <h2 className="text-[14px] font-semibold text-[#1a1a1a]">Live Preview</h2>
          <p className="text-[11px] text-[#888888] font-mono mt-0.5">Updates as you edit</p>
        </div>
        <ShareButton />
      </div>

      {/* Content area — no fixed height, grows with signature */}
      <div className="p-5 flex flex-col items-center">

        {/* Phone shell — overflow:hidden clips to rounded corners */}
        <div className="rounded-[2rem] border-[5px] border-[#cccccc] bg-white overflow-hidden shadow-md w-full max-w-[340px]">
          {/* Status bar */}
          <div className="bg-white px-5 pt-3 pb-1 flex items-center justify-between">
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

          {/* Email body — no fixed height, grows with iframe */}
          <div className="bg-white px-4 py-3">
            <p className="text-[10px] text-[#444444] mb-3 leading-relaxed">
              Hi there, thanks for reaching out.<br />Best,
            </p>

            {/* Container clamps height 500-900px; iframe fills it exactly */}
            <div style={{ width: `${containerWidth}px`, height: `${Math.min(Math.max(containerHeight, 500), 900)}px`, overflow: 'hidden', position: 'relative' }}>
              <iframe
                ref={iframeRef}
                title="Mobile Signature Preview"
                style={{
                  width: `${IFRAME_NATURAL_WIDTH}px`,
                  height: `${Math.min(Math.max(containerHeight, 500), 900) / MOBILE_SCALE}px`,
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
            <div className="w-20 h-1 rounded-full bg-[#cccccc]" />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 px-1 max-w-[340px] w-full">
          <Info size={12} className="mt-0.5 shrink-0 icon-muted" />
          <p className="text-[11px] text-[#888888] leading-relaxed">
            Scaled to ~55% to represent retina rendering. The actual signature displays correctly on device.
          </p>
        </div>

      </div>
    </div>
  );
}
