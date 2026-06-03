/**
 * generateFoleyHtml
 * ==================
 * Produces the "The Foley" single-column email signature HTML.
 *
 * Layout (top to bottom):
 *   Full Name         — bold, brand color (default #1a6abf blue)
 *   Job Title         — italic
 *   [spacer]
 *   Company Name      — bold, brand color, links to company website
 *   Street Address    — plain text
 *   Phone             — "Phone 000.000.0000"
 *   Links row         — pipe-separated: Bio | Website | LinkedIn | Email
 *   [spacer]
 *   Logo              — placeholder image (200×60 px)
 *   [spacer]
 *   Confidentiality   — small italic text (optional)
 *
 * Compatible with: Gmail, Outlook 2016/2019/365, Apple Mail, HubSpot.
 * All layout uses nested <table> — no <div>, no flexbox, all inline styles.
 */

export interface FoleyFields {
  fullName: string;
  jobTitle: string;
  companyName: string;
  companyUrl: string;
  streetAddress: string;
  phone: string;
  email: string;
  bioUrl: string;
  linkedinUrl: string;
  logoUrl: string;
  brandColor: string;
  confidentialityEnabled: boolean;
  confidentialityText: string;
  // Tracking
  trackingEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}

export const DEFAULT_FOLEY_FIELDS: FoleyFields = {
  fullName: 'Whit Johnson',
  jobTitle: 'Partner',
  companyName: 'Foley & Lardner LLP',
  companyUrl: 'https://foley.com',
  streetAddress: '95 S State Street, Suite 2500, Salt Lake City, UT 84111',
  phone: '801.401.8942',
  email: 'whit.johnson@foley.com',
  bioUrl: 'https://foley.com/bio',
  linkedinUrl: 'https://linkedin.com/company/foley-lardner',
  logoUrl: '',
  brandColor: '#1a6abf',
  confidentialityEnabled: false,
  confidentialityText: 'CONFIDENTIALITY NOTICE: This email and any attachments are for the exclusive and confidential use of the intended recipient. If you are not the intended recipient, please do not read, distribute, or take action in reliance upon this message.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
};

function buildUtm(fields: FoleyFields): string {
  if (!fields.trackingEnabled) return '';
  const p: string[] = [];
  if (fields.utmSource) p.push(`utm_source=${encodeURIComponent(fields.utmSource)}`);
  if (fields.utmMedium) p.push(`utm_medium=${encodeURIComponent(fields.utmMedium)}`);
  if (fields.utmCampaign) p.push(`utm_campaign=${encodeURIComponent(fields.utmCampaign)}`);
  if (fields.utmContent) p.push(`utm_content=${encodeURIComponent(fields.utmContent)}`);
  return p.length > 0 ? `?${p.join('&')}` : '';
}

function addUtm(url: string, utm: string): string {
  if (!utm || !url) return url;
  if (url.includes('utm_')) return url;
  return url + (url.includes('?') ? '&' : '?') + utm.replace(/^\?/, '');
}

export function generateFoleyHtml(fields: FoleyFields): string {
  const {
    fullName, jobTitle, companyName, companyUrl, streetAddress,
    phone, email, bioUrl, linkedinUrl, logoUrl, brandColor,
    confidentialityEnabled, confidentialityText,
  } = fields;

  const utm = buildUtm(fields);
  const logoSrc = logoUrl || `https://placehold.co/200x60/ffffff/333333?text=${encodeURIComponent(companyName || 'Company')}`;

  const clauseBlock = confidentialityEnabled && confidentialityText.trim()
    ? `
  <tr>
    <td style="padding:14px 0 0 0;border-top:1px solid #e8e8e8;">
      <p style="margin:0;font-size:9px;line-height:1.5;color:#999999;font-style:italic;font-family:Arial,Helvetica,sans-serif;">${confidentialityText.replace(/\n/g, '<br/>')}</p>
    </td>
  </tr>`
    : '';

  // Build pipe-separated links row — only include links that have a URL
  const linkItems: string[] = [];
  if (bioUrl) linkItems.push(`<a href="${addUtm(bioUrl, utm)}" style="color:${brandColor};text-decoration:none;font-size:13px;">View My Bio</a>`);
  if (companyUrl) linkItems.push(`<a href="${addUtm(companyUrl, utm)}" style="color:${brandColor};text-decoration:none;font-size:13px;">Visit ${companyName || 'Website'}</a>`);
  if (linkedinUrl) linkItems.push(`<a href="${addUtm(linkedinUrl, utm)}" style="color:${brandColor};text-decoration:none;font-size:13px;">Follow us on LinkedIn</a>`);
  if (email) linkItems.push(`<a href="mailto:${email}" style="color:${brandColor};text-decoration:none;font-size:13px;">${email}</a>`);
  const linksHtml = linkItems.join(`<span style="color:#999999;font-size:13px;padding:0 6px;">|</span>`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#ffffff;">

<table width="560" cellpadding="0" cellspacing="0" border="0"
  style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222222;background-color:#ffffff;max-width:560px;">

  <!-- Full Name -->
  <tr>
    <td style="padding:0 0 2px 0;">
      <p style="margin:0;font-size:16px;font-weight:bold;color:${brandColor};font-family:Arial,Helvetica,sans-serif;">${fullName}</p>
    </td>
  </tr>

  <!-- Job Title -->
  <tr>
    <td style="padding:0 0 14px 0;">
      <p style="margin:0;font-size:13px;font-style:italic;color:#333333;font-family:Arial,Helvetica,sans-serif;">${jobTitle}</p>
    </td>
  </tr>

  <!-- Company Name -->
  <tr>
    <td style="padding:0 0 4px 0;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;">
        <a href="${addUtm(companyUrl, utm)}" style="font-size:13px;font-weight:bold;color:${brandColor};text-decoration:none;">${companyName}</a>
      </p>
    </td>
  </tr>

  <!-- Street Address -->
  <tr>
    <td style="padding:0 0 4px 0;">
      <p style="margin:0;font-size:13px;color:#333333;font-family:Arial,Helvetica,sans-serif;">${streetAddress}</p>
    </td>
  </tr>

  <!-- Phone -->
  <tr>
    <td style="padding:0 0 10px 0;">
      <p style="margin:0;font-size:13px;color:#333333;font-family:Arial,Helvetica,sans-serif;">Phone ${phone}</p>
    </td>
  </tr>

  <!-- Links row -->
  <tr>
    <td style="padding:0 0 18px 0;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">${linksHtml}</p>
    </td>
  </tr>

  <!-- Logo -->
  <tr>
    <td style="padding:20px 0 20px 0;">
      <img
        src="${logoSrc}"
        alt="${companyName}"
        style="display:block;border:0;max-width:300px;max-height:80px;width:auto;height:auto;"
      />
    </td>
  </tr>

  ${clauseBlock}

</table>

</body>
</html>`;
}
