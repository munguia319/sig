/**
 * generateDozerHtml
 * ==================
 * "The Dozer" — single-column layout with two horizontal rules.
 *
 * Structure (top to bottom):
 *   ─── top HR ───────────────────────────────────────────────
 *   Bold Name   Gray Title
 *   ─── sub HR ───────────────────────────────────────────────
 *   [spacer]
 *   cell: (000) 000-0000
 *   office: (000) 000-0000 ext 000
 *   email@company.com          ← brand color, clickable
 *   www.company.com
 *   Custom promo text with a hyperlink   ← italic, brand color link
 *   [spacer]
 *   ─── bottom HR ────────────────────────────────────────────
 *   [spacer]
 *   ┌──────────────────────────────────────────────────────┐
 *   │ Instagram  X/Twitter  Facebook (gray SVG icons, left)│  Logo IMG (right)
 *   └──────────────────────────────────────────────────────┘
 *   [spacer]
 *   Confidentiality clause (italic, small, optional)
 *
 * Brand color controls: email link color, promo hyperlink color.
 * Social icons: inline SVG (Instagram, X/Twitter, Facebook) in gray.
 * Compatible with: Gmail, Outlook 2016/2019/365, Apple Mail, HubSpot.
 */

export interface DozerFields {
  fullName: string;
  jobTitle: string;
  cellPhone: string;
  officePhone: string;
  email: string;
  website: string;
  promoText: string;
  promoLinkText: string;
  promoLinkUrl: string;
  logoUrl: string;
  brandColor: string;
  // Social (leave blank to hide)
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  // Confidentiality
  confidentialityEnabled: boolean;
  confidentialityText: string;
  // Tracking
  trackingEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export const DEFAULT_DOZER_FIELDS: DozerFields = {
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  cellPhone: '123-456-7890',
  officePhone: '123-456-7890 ext 000',
  email: 'name@company.com',
  website: 'www.company.com',
  promoText: 'Custom text or promo copy here with a',
  promoLinkText: 'link',
  promoLinkUrl: 'https://company.com',
  logoUrl: '',
  brandColor: '#cc44cc',
  linkedinUrl: 'https://linkedin.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: 'https://x.com',
  facebookUrl: 'https://facebook.com',
  confidentialityEnabled: true,
  confidentialityText: 'Add the confidentiality copy here.. Add the confidentiality copy here. Add the confidentiality copy here. Add the confidentiality copy here. Add the confidentiality copy here. Add the confidentiality copy here.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildUtm(f: DozerFields): string {
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

// Inline SVG social icons (gray #888888)
const ICONS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="#888888" style="display:block;"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="#888888" style="display:block;"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" fill="#888888" style="display:block;"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="18" height="18" fill="#888888" style="display:block;"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>`,
};

function socialCell(url: string, iconHtml: string, utm: string): string {
  if (!url) return '';
  return `<td style="padding:0 12px 0 0;vertical-align:middle;">
    <a href="${addUtm(url, utm)}" target="_blank" style="text-decoration:none;">${iconHtml}</a>
  </td>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateDozerHtml(f: DozerFields): string {
  const {
    fullName, jobTitle, cellPhone, officePhone, email, website,
    promoText, promoLinkText, promoLinkUrl,
    logoUrl, brandColor,
    linkedinUrl, instagramUrl, twitterUrl, facebookUrl,
    confidentialityEnabled, confidentialityText,
  } = f;

  const utm = buildUtm(f);
  const logoSrc = logoUrl || 'https://placehold.co/180x70/e0e0e0/888888?text=Logo+IMG';
  const websiteHref = website.startsWith('http') ? website : `https://${website}`;

  const clauseBlock = confidentialityEnabled && confidentialityText.trim()
    ? `
  <tr>
    <td style="padding:10px 0 0 0;">
      <p style="margin:0;font-size:10px;line-height:1.6;color:#666666;font-style:italic;font-family:Arial,Helvetica,sans-serif;">${confidentialityText.replace(/\n/g, '<br/>')}</p>
    </td>
  </tr>`
    : '';

  const socialCells = [
    socialCell(linkedinUrl, ICONS.linkedin, utm),
    socialCell(instagramUrl, ICONS.instagram, utm),
    socialCell(twitterUrl, ICONS.twitter, utm),
    socialCell(facebookUrl, ICONS.facebook, utm),
  ].filter(Boolean).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#ffffff;">

<table width="560" cellpadding="0" cellspacing="0" border="0"
  style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;background-color:#ffffff;max-width:560px;">

  <!-- Top HR -->
  <tr>
    <td style="padding:0 0 10px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="height:1px;background-color:#cccccc;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- Name + Title row -->
  <tr>
    <td style="padding:0 0 8px 0;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;">
        <strong style="font-size:20px;color:#111111;font-weight:bold;">${fullName}</strong>
        ${jobTitle ? `&nbsp;&nbsp;&nbsp;<span style="font-size:16px;color:#888888;font-weight:normal;">${jobTitle}</span>` : ''}
      </p>
    </td>
  </tr>

  <!-- Sub HR -->
  <tr>
    <td style="padding:0 0 14px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="height:1px;background-color:#cccccc;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- Cell phone -->
  ${cellPhone ? `
  <tr>
    <td style="padding:0 0 6px 0;">
      <p style="margin:0;font-size:13px;color:#333333;font-family:Arial,Helvetica,sans-serif;">cell: ${cellPhone}</p>
    </td>
  </tr>` : ''}

  <!-- Office phone -->
  ${officePhone ? `
  <tr>
    <td style="padding:0 0 6px 0;">
      <p style="margin:0;font-size:13px;color:#333333;font-family:Arial,Helvetica,sans-serif;">office: ${officePhone}</p>
    </td>
  </tr>` : ''}

  <!-- Email — brand color -->
  ${email ? `
  <tr>
    <td style="padding:0 0 6px 0;">
      <a href="mailto:${email}" style="font-size:13px;color:${brandColor};text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${email}</a>
    </td>
  </tr>` : ''}

  <!-- Website -->
  ${website ? `
  <tr>
    <td style="padding:0 0 10px 0;">
      <a href="${addUtm(websiteHref, utm)}" target="_blank" style="font-size:13px;color:#333333;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${website}</a>
    </td>
  </tr>` : ''}

  <!-- Promo text with inline hyperlink -->
  ${promoText || promoLinkText ? `
  <tr>
    <td style="padding:0 0 14px 0;">
      <p style="margin:0;font-size:13px;font-style:italic;color:#333333;font-family:Arial,Helvetica,sans-serif;">
        ${promoText ? `${promoText} ` : ''}${promoLinkText && promoLinkUrl ? `<a href="${addUtm(promoLinkUrl, utm)}" target="_blank" style="color:${brandColor};text-decoration:underline;font-style:italic;">${promoLinkText}</a>` : ''}
      </p>
    </td>
  </tr>` : ''}

  <!-- Bottom HR -->
  <tr>
    <td style="padding:0 0 14px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="height:1px;background-color:#cccccc;font-size:0;line-height:0;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>

  <!-- Social icons (left) + Logo (right) -->
  <tr>
    <td style="padding:0 0 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr valign="middle">
          <!-- Social icons -->
          <td valign="middle" style="padding:0;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr valign="middle">
                ${socialCells}
              </tr>
            </table>
          </td>
          <!-- Logo -->
          <td valign="middle" style="padding:20px 0;text-align:right;">
            <img
              src="${logoSrc}"
              alt="Logo"
              style="display:block;border:0;max-width:300px;max-height:100px;width:auto;height:auto;margin-left:auto;"
            />
          </td>
        </tr>
      </table>
    </td>
  </tr>

  ${clauseBlock}

</table>

</body>
</html>`;
}
