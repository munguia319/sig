/**
 * generateJohnsonHtml
 * ====================
 * "The Johnson" — two-column layout.
 *
 * Structure:
 *   LEFT:  Circular photo with orange border
 *   RIGHT: Bold name
 *          Job title (brand color) • Department
 *          ── orange HR ──
 *          Company name (bold)
 *          Email (brand color link)
 *          Phone
 *          Website (brand color link)
 *          Address (small gray)
 *          Logo image
 *          Social icons row (LinkedIn, Instagram — inline SVG)
 *
 * Brand color controls: photo border, job title, HR, email link, website link.
 * Compatible with: Gmail, Outlook 2016/2019/365, Apple Mail, HubSpot.
 * All layout uses nested <table> — no <div>, no flexbox, all inline styles.
 * Icons are inline SVG — no external scripts required.
 */

export interface JohnsonFields {
  fullName: string;
  jobTitle: string;
  department: string;
  companyName: string;
  email: string;
  phone: string;
  website: string;
  streetAddress: string;
  photoUrl: string;
  logoUrl: string;
  brandColor: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  confidentialityEnabled: boolean;
  confidentialityText: string;
  trackingEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export const DEFAULT_JOHNSON_FIELDS: JohnsonFields = {
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  department: 'Creative',
  companyName: 'Company',
  email: 'name@company.com',
  phone: '123-456-7890',
  website: 'company.com',
  streetAddress: '1234 Street Address, City, ST 00000',
  photoUrl: '',
  logoUrl: '',
  brandColor: '#EC654E',
  linkedinUrl: 'https://linkedin.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: 'https://x.com',
  youtubeUrl: 'https://youtube.com',
  facebookUrl: 'https://facebook.com',
  confidentialityEnabled: false,
  confidentialityText: 'CONFIDENTIALITY NOTICE: This email and any attachments are for the exclusive and confidential use of the intended recipient. If you are not the intended recipient, please do not read, distribute, or take action in reliance upon this message.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildUtm(f: JohnsonFields): string {
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

// Inline SVG social icons (brand color)
function twitterSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" style="display:inline-block;vertical-align:middle;border-radius:3px;" fill="${color}"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>`;
}

function youtubeSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="20" style="display:inline-block;vertical-align:middle;border-radius:3px;" fill="${color}"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>`;
}

function facebookSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="20" height="20" style="display:inline-block;vertical-align:middle;border-radius:3px;" fill="${color}"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>`;
}

function linkedinSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" style="display:inline-block;vertical-align:middle;border-radius:3px;" fill="${color}"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>`;
}

function instagramSvg(color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" style="display:inline-block;vertical-align:middle;border-radius:3px;" fill="${color}"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateJohnsonHtml(f: JohnsonFields): string {
  const {
    fullName, jobTitle, department, companyName,
    email, phone, website, streetAddress,
    photoUrl, logoUrl, brandColor,
    linkedinUrl, instagramUrl,
    confidentialityEnabled, confidentialityText,
  } = f;

  const utm = buildUtm(f);
  const photoSrc = photoUrl || 'https://placehold.co/80x80/eeeeee/999999?text=Photo';
  const logoSrc = logoUrl || `https://placehold.co/120x36/eeeeee/999999?text=${encodeURIComponent(companyName || 'Logo')}`;
  const websiteHref = website.startsWith('http') ? website : `https://${website}`;

  const {
    twitterUrl, youtubeUrl, facebookUrl,
  } = f;

  const socialRow = (linkedinUrl || twitterUrl || youtubeUrl || facebookUrl || instagramUrl) ? `
    <tr>
      <td colspan="2" style="padding-top:8px;">
        ${linkedinUrl ? `<a href="${addUtm(linkedinUrl, utm)}" target="_blank" style="text-decoration:none;margin-right:8px;">${linkedinSvg(brandColor)}</a>` : ''}
        ${twitterUrl ? `<a href="${addUtm(twitterUrl, utm)}" target="_blank" style="text-decoration:none;margin-right:8px;">${twitterSvg(brandColor)}</a>` : ''}
        ${youtubeUrl ? `<a href="${addUtm(youtubeUrl, utm)}" target="_blank" style="text-decoration:none;margin-right:8px;">${youtubeSvg(brandColor)}</a>` : ''}
        ${facebookUrl ? `<a href="${addUtm(facebookUrl, utm)}" target="_blank" style="text-decoration:none;margin-right:8px;">${facebookSvg(brandColor)}</a>` : ''}
        ${instagramUrl ? `<a href="${addUtm(instagramUrl, utm)}" target="_blank" style="text-decoration:none;margin-right:8px;">${instagramSvg(brandColor)}</a>` : ''}
      </td>
    </tr>` : '';

  const clauseBlock = confidentialityEnabled && confidentialityText.trim()
    ? `
  <tr>
    <td colspan="2" style="padding-top:12px;border-top:1px solid #e8e8e8;">
      <p style="margin:0;font-size:9px;line-height:1.5;color:#999999;font-style:italic;font-family:Arial,Helvetica,sans-serif;">${confidentialityText.replace(/\n/g, '<br/>')}</p>
    </td>
  </tr>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#ffffff;">

<table cellpadding="0" cellspacing="0" border="0"
  style="font-family:Arial,Helvetica,sans-serif;max-width:520px;background:#ffffff;">
  <tr>

    <!-- LEFT: Circular photo with brand-color border -->
    <td style="padding-right:16px;vertical-align:top;">
      <img
        src="${photoSrc}"
        alt="${fullName}"
        style="border-radius:50%;display:block;border:2px solid ${brandColor};max-width:80px;max-height:80px;width:80px;height:80px;object-fit:cover;"
      />
    </td>

    <!-- RIGHT: All contact details -->
    <td style="vertical-align:top;border-left:1px solid #dddddd;padding-left:16px;">
      <table cellpadding="0" cellspacing="0" border="0">

        <!-- Name -->
        <tr>
          <td colspan="2" style="padding-bottom:2px;">
            <span style="font-size:15px;font-weight:700;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">${fullName}</span>
          </td>
        </tr>

        <!-- Job title • Department -->
        <tr>
          <td colspan="2" style="padding-bottom:6px;">
            <span style="font-size:12px;color:${brandColor};font-family:Arial,Helvetica,sans-serif;font-weight:600;">${jobTitle}</span>
            ${department ? `<span style="font-size:12px;color:#888888;font-family:Arial,Helvetica,sans-serif;"> &bull; ${department}</span>` : ''}
          </td>
        </tr>

        <!-- Orange HR -->
        <tr>
          <td colspan="2" style="padding:8px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-top:2px solid ${brandColor};font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- Company name -->
        ${companyName ? `
        <tr>
          <td colspan="2" style="padding-bottom:4px;font-size:12px;font-weight:600;color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">${companyName}</td>
        </tr>` : ''}

        <!-- Email -->
        ${email ? `
        <tr>
          <td colspan="2" style="padding-bottom:2px;font-size:12px;color:#444444;font-family:Arial,Helvetica,sans-serif;">
            <a href="mailto:${email}" style="color:${brandColor};text-decoration:none;">${email}</a>
          </td>
        </tr>` : ''}

        <!-- Phone -->
        ${phone ? `
        <tr>
          <td colspan="2" style="padding-bottom:2px;font-size:12px;color:#444444;font-family:Arial,Helvetica,sans-serif;">
            <a href="tel:${phone.replace(/\s/g, '')}" style="color:#444444;text-decoration:none;">${phone}</a>
          </td>
        </tr>` : ''}

        <!-- Website -->
        ${website ? `
        <tr>
          <td colspan="2" style="padding-bottom:2px;font-size:12px;color:#444444;font-family:Arial,Helvetica,sans-serif;">
            <a href="${addUtm(websiteHref, utm)}" target="_blank" style="color:${brandColor};text-decoration:none;">${website}</a>
          </td>
        </tr>` : ''}

        <!-- Address -->
        ${streetAddress ? `
        <tr>
          <td colspan="2" style="padding-top:4px;font-size:11px;color:#888888;font-family:Arial,Helvetica,sans-serif;">${streetAddress}</td>
        </tr>` : ''}

        <!-- Logo -->
        <tr>
          <td colspan="2" style="padding:20px 0 0 0;">
            <img
              src="${logoSrc}"
              alt="${companyName}"
              style="display:block;border:0;max-width:200px;max-height:60px;width:auto;height:auto;"
            />
          </td>
        </tr>

        <!-- Social icons -->
        ${socialRow}

        ${clauseBlock}

      </table>
    </td>

  </tr>
</table>

</body>
</html>`;
}
