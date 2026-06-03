/**
 * generateStorysnapHtml
 * ======================
 * "The Storysnap" — single-column layout.
 *
 * Structure (top to bottom):
 *   Logo             — placeholder image (160×40 px), above the name
 *   [spacer]
 *   Full Name        — bold black
 *   Title - Company  — plain text, single line
 *   Brands line      — plain text (e.g. "Brands: X & Y")
 *   CTA Link         — underlined, brand color
 *   [colored HR]     — 1px solid, brand color, ~300px wide
 *   [spacer]
 *   Email row        — inline SVG envelope icon (brand color) + email address
 *   Website row      — inline SVG globe icon (brand color) + website URL
 *   [spacer]
 *   Confidentiality  — small italic text (optional)
 *
 * Single `brandColor` field controls: HR color, icon fill, CTA link color.
 *
 * Compatible with: Gmail, Outlook 2016/2019/365, Apple Mail, HubSpot.
 * All layout uses nested <table> — no <div>, no flexbox, all inline styles.
 * Icons are inline SVG — no external scripts required.
 */

export interface StorysnapFields {
  fullName: string;
  jobTitle: string;
  companyName: string;
  brandsLine: string;
  ctaText: string;
  ctaUrl: string;
  email: string;
  website: string;
  logoUrl: string;
  brandColor: string;
  confidentialityEnabled: boolean;
  confidentialityText: string;
  trackingEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export const DEFAULT_STORYSNAP_FIELDS: StorysnapFields = {
  fullName: 'Dan Gemmell',
  jobTitle: 'Sr. Account Executive',
  companyName: 'Storysnap',
  brandsLine: 'Brands: Testimonial Hero & Product Hype',
  ctaText: 'See why proof beats persuasion',
  ctaUrl: 'https://storysnap.com',
  email: 'dan.gemmell@storysnap.com',
  website: 'www.storysnap.com',
  logoUrl: '',
  brandColor: '#e8417a',
  confidentialityEnabled: false,
  confidentialityText: 'CONFIDENTIALITY NOTICE: This email and any attachments are for the exclusive and confidential use of the intended recipient. If you are not the intended recipient, please do not read, distribute, or take action in reliance upon this message.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildUtm(f: StorysnapFields): string {
  if (!f.trackingEnabled) return '';
  const p: string[] = [];
  if (f.utmSource) p.push(`utm_source=${encodeURIComponent(f.utmSource)}`);
  if (f.utmMedium) p.push(`utm_medium=${encodeURIComponent(f.utmMedium)}`);
  if (f.utmCampaign) p.push(`utm_campaign=${encodeURIComponent(f.utmCampaign)}`);
  if (f.utmContent) p.push(`utm_content=${encodeURIComponent(f.utmContent)}`);
  return p.length > 0 ? `?${p.join('&')}` : '';
}

function addUtm(url: string, utm: string): string {
  if (!utm || !url) return url;
  if (url.includes('utm_')) return url;
  return url + (url.includes('?') ? '&' : '?') + utm.replace(/^\?/, '');
}

// Inline SVG icons — brand color applied at render time
function envelopeIcon(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" style="display:inline-block;vertical-align:middle;border:1.5px solid ${color};border-radius:3px;padding:1px;" fill="${color}"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>`;
}

function globeIcon(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" style="display:inline-block;vertical-align:middle;border:1.5px solid ${color};border-radius:50%;padding:1px;" fill="${color}"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.5 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.5-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateStorysnapHtml(f: StorysnapFields): string {
  const {
    fullName, jobTitle, companyName, brandsLine,
    ctaText, ctaUrl, email, website, logoUrl, brandColor,
    confidentialityEnabled, confidentialityText,
  } = f;

  const utm = buildUtm(f);
  const logoSrc = logoUrl || `https://placehold.co/160x40/ffffff/333333?text=${encodeURIComponent(companyName || 'Logo')}`;
  const websiteHref = website.startsWith('http') ? website : `https://${website}`;

  const clauseBlock = confidentialityEnabled && confidentialityText.trim()
    ? `
  <tr>
    <td style="padding:12px 0 0 0;border-top:1px solid #e8e8e8;">
      <p style="margin:0;font-size:9px;line-height:1.5;color:#999999;font-style:italic;font-family:Arial,Helvetica,sans-serif;">${confidentialityText.replace(/\n/g, '<br/>')}</p>
    </td>
  </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#ffffff;">

<table width="480" cellpadding="0" cellspacing="0" border="0"
  style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222222;background-color:#ffffff;max-width:480px;">

  <!-- Logo -->
  <tr>
    <td style="padding:20px 0 12px 0;">
      <img
        src="${logoSrc}"
        alt="${companyName}"
        style="display:block;border:0;max-width:300px;max-height:80px;width:auto;height:auto;"
      />
    </td>
  </tr>

  <!-- Full Name -->
  <tr>
    <td style="padding:0 0 2px 0;">
      <p style="margin:0;font-size:14px;font-weight:bold;color:#111111;font-family:Arial,Helvetica,sans-serif;">${fullName}</p>
    </td>
  </tr>

  <!-- Title - Company -->
  <tr>
    <td style="padding:0 0 2px 0;">
      <p style="margin:0;font-size:13px;color:#333333;font-family:Arial,Helvetica,sans-serif;">${jobTitle}${companyName ? ` - ${companyName}` : ''}</p>
    </td>
  </tr>

  <!-- Brands line -->
  ${brandsLine ? `
  <tr>
    <td style="padding:0 0 6px 0;">
      <p style="margin:0;font-size:13px;color:#333333;font-family:Arial,Helvetica,sans-serif;">${brandsLine}</p>
    </td>
  </tr>` : ''}

  <!-- CTA Link -->
  ${ctaText && ctaUrl ? `
  <tr>
    <td style="padding:0 0 12px 0;">
      <a href="${addUtm(ctaUrl, utm)}" target="_blank" style="font-size:13px;color:#333333;text-decoration:underline;font-family:Arial,Helvetica,sans-serif;">${ctaText}</a>
    </td>
  </tr>` : ''}

  <!-- Colored horizontal rule -->
  <tr>
    <td style="padding:0 0 12px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="300">
        <tr>
          <td style="height:1px;background-color:${brandColor};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Email row -->
  <tr>
    <td style="padding:0 0 8px 0;">
      <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
        <td width="24" style="padding:0 8px 0 0;text-align:center;">${envelopeIcon(brandColor)}</td>
        <td>
          <a href="mailto:${email}" style="font-size:13px;color:#333333;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${email}</a>
        </td>
      </tr></table>
    </td>
  </tr>

  <!-- Website row -->
  <tr>
    <td style="padding:0 0 0 0;">
      <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
        <td width="24" style="padding:0 8px 0 0;text-align:center;">${globeIcon(brandColor)}</td>
        <td>
          <a href="${addUtm(websiteHref, utm)}" target="_blank" style="font-size:13px;color:#333333;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${website}</a>
        </td>
      </tr></table>
    </td>
  </tr>

  ${clauseBlock}

</table>

</body>
</html>`;
}
