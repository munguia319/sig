/**
 * generateSquaxeHtml
 * ===================
 * "The Squaxe" — three-column layout.
 *
 * Structure:
 *
 *   ┌──────────┬──────────────┬──────────────────────────────────────┐
 *   │ Social   │ Circular     │ Bold Name  Italic Title              │
 *   │ Icons    │ Photo        │ email@co.com  |  123-456-7890        │
 *   │ (left)   │ (center)     │ www.website.com                      │
 *   │          │              │ 1234 Street, City, ST 00000          │
 *   │          │              │ ┌──────────────────┐                 │
 *   │          │              │ │  Logo (bordered) │                 │
 *   │          │              │ └──────────────────┘                 │
 *   └──────────┴──────────────┴──────────────────────────────────────┘
 *   ─────────────────────────── HR ───────────────────────────────────
 *   ┌──────────────────────────────────────────────────────────────────┐
 *   │                     Banner Image (IMG)                           │
 *   └──────────────────────────────────────────────────────────────────┘
 *   Confidentiality clause text (optional, small italic)
 *
 * Social icons: inline SVG paths for LinkedIn, X/Twitter, Facebook,
 *               Instagram, YouTube — rendered in gray (#888888).
 * All icons are inline SVG — no external scripts required.
 * Compatible with: Gmail, Outlook 2016/2019/365, Apple Mail, HubSpot.
 */

export interface SquaxeFields {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  streetAddress: string;
  photoUrl: string;
  logoUrl: string;
  bannerUrl: string;
  // Social links (empty = icon hidden)
  linkedinUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
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

export const DEFAULT_SQUAXE_FIELDS: SquaxeFields = {
  fullName: 'Julie Harbaugh',
  jobTitle: 'Chief Signature Officer',
  email: 'email@emailsignature.com',
  phone: '123-456-7890',
  website: 'www.website.com',
  streetAddress: '1234 Fake Street, Chicago, IL 60617',
  photoUrl: '',
  logoUrl: '',
  bannerUrl: '',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://x.com',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  confidentialityEnabled: true,
  confidentialityText: 'The content of this message is confidential and intended only for the designated recipient(s). If you received it by mistake, please let us know and then delete it. Please do not copy, forward, or in any way reveal the content of this message. Given that messages sent via the Internet can be intercepted, corrupted and infected, please check this message for threats via proper software.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildUtm(f: SquaxeFields): string {
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

// Social icon SVG paths (all viewBox 0 0 448 512 unless noted)
const SOCIAL_ICONS: Record<string, { path: string; viewBox: string }> = {
  linkedin: {
    viewBox: '0 0 448 512',
    path: 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z',
  },
  twitter: {
    viewBox: '0 0 512 512',
    path: 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z',
  },
  facebook: {
    viewBox: '0 0 320 512',
    path: 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z',
  },
  instagram: {
    viewBox: '0 0 448 512',
    path: 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z',
  },
  youtube: {
    viewBox: '0 0 576 512',
    path: 'M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z',
  },
};

function socialIconCell(url: string, iconKey: string, utm: string): string {
  if (!url) return '';
  const icon = SOCIAL_ICONS[iconKey];
  if (!icon) return '';
  return `
    <tr>
      <td style="padding:0 0 8px 0;text-align:center;">
        <a href="${addUtm(url, utm)}" target="_blank" style="text-decoration:none;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="16" height="16" fill="#888888" style="display:block;margin:0 auto;">
            <path d="${icon.path}"/>
          </svg>
        </a>
      </td>
    </tr>`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateSquaxeHtml(f: SquaxeFields): string {
  const {
    fullName, jobTitle, email, phone, website, streetAddress,
    photoUrl, logoUrl, bannerUrl,
    linkedinUrl, twitterUrl, facebookUrl, instagramUrl, youtubeUrl,
    confidentialityEnabled, confidentialityText,
  } = f;

  const utm = buildUtm(f);

  const photoSrc = photoUrl || 'https://placehold.co/90x90/cccccc/555555?text=Photo';
  const logoSrc = logoUrl || 'https://placehold.co/160x60/f8f8f8/333333?text=Logo';
  const bannerSrc = bannerUrl || 'https://placehold.co/560x120/e8e8e8/888888?text=IMG';
  const websiteHref = website.startsWith('http') ? website : `https://${website}`;

  const clauseBlock = confidentialityEnabled && confidentialityText.trim()
    ? `
  <tr>
    <td colspan="3" style="padding:14px 0 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="560">
        <tr>
          <td style="padding:10px 0 0 0;border-top:1px solid #e8e8e8;width:560px;">
            <p style="margin:0;font-size:10px;line-height:1.6;color:#666666;font-family:Arial,Helvetica,sans-serif;max-width:560px;width:560px;">${confidentialityText.replace(/\n/g, '<br/>')}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#ffffff;">

<table width="560" cellpadding="0" cellspacing="0" border="0"
  style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333333;background-color:#ffffff;max-width:560px;">

  <!-- ── Main three-column row ── -->
  <tr>

    <!-- COL 1: Social icons (vertical stack) -->
    <td width="36" valign="top" style="padding:4px 12px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0">
        ${socialIconCell(linkedinUrl, 'linkedin', utm)}
        ${socialIconCell(twitterUrl, 'twitter', utm)}
        ${socialIconCell(facebookUrl, 'facebook', utm)}
        ${socialIconCell(instagramUrl, 'instagram', utm)}
        ${socialIconCell(youtubeUrl, 'youtube', utm)}
      </table>
    </td>

    <!-- COL 2: Circular photo -->
    <td width="100" valign="top" style="padding:0 16px 0 0;">
      <img
        src="${photoSrc}"
        alt="${fullName}"
        style="display:block;border-radius:50%;border:0;object-fit:cover;width:90px;height:90px;max-width:90px;max-height:90px;"
      />
    </td>

    <!-- COL 3: Name / Title / Contact / Logo -->
    <td valign="top" style="padding:0;">

      <!-- Name + italic title on same line -->
      <p style="margin:0 0 6px 0;font-family:Arial,Helvetica,sans-serif;">
        <strong style="font-size:14px;color:#111111;">${fullName}</strong>
        ${jobTitle ? `&nbsp;&nbsp;<em style="font-size:13px;color:#888888;font-weight:normal;">${jobTitle}</em>` : ''}
      </p>

      <!-- Email | Phone -->
      <p style="margin:0 0 4px 0;font-size:12px;color:#888888;font-family:Arial,Helvetica,sans-serif;">
        ${email ? `<a href="mailto:${email}" style="color:#888888;text-decoration:none;">${email}</a>` : ''}
        ${email && phone ? `&nbsp;&nbsp;<span style="color:#cccccc;">|</span>&nbsp;&nbsp;` : ''}
        ${phone ? `<span>${phone}</span>` : ''}
      </p>

      <!-- Website -->
      ${website ? `<p style="margin:0 0 4px 0;font-size:12px;color:#888888;font-family:Arial,Helvetica,sans-serif;">
        <a href="${addUtm(websiteHref, utm)}" target="_blank" style="color:#888888;text-decoration:none;">${website}</a>
      </p>` : ''}

      <!-- Address -->
      ${streetAddress ? `<p style="margin:0 0 10px 0;font-size:12px;color:#888888;font-family:Arial,Helvetica,sans-serif;">${streetAddress}</p>` : ''}

      <!-- Logo — no border, left-aligned with contact details -->
      <img
        src="${logoSrc}"
        alt="Logo"
        style="display:block;border:0;max-width:200px;max-height:60px;width:auto;height:auto;margin-top:20px;margin-bottom:20px;"
      />

    </td>
  </tr>

  <!-- ── Horizontal rule ── -->
  <tr>
    <td colspan="3" style="padding:14px 0 14px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="height:1px;background-color:#e0e0e0;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── Banner image ── -->
  <tr>
    <td colspan="3" style="padding:0;">
      <img
        src="${bannerSrc}"
        alt="Banner"
        style="display:block;border:0;max-width:560px;max-height:200px;width:auto;height:auto;"
      />
    </td>
  </tr>

  ${clauseBlock}

</table>

</body>
</html>`;
}
