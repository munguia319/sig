/**
 * generateSignatureHtml
 * ======================
 * Produces the exact table-based HTML email signature string.
 *
 * Compatible with: Gmail, Outlook 2016/2019/365, Apple Mail, HubSpot.
 *
 * Features:
 *   - Inline SVG icons (no external dependencies, works in sandboxed iframes)
 *   - UTM tracking parameters appended to all links when enabled
 *   - Confidentiality clause rendered as small italic text below the signature
 */

import type { SignatureFields } from '../contexts/SignatureContext';

// ── SVG icon helper ──────────────────────────────────────────────────────────

function svgIcon(path: string, color: string, size = 14): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle;" fill="${color}"><path d="${path}"/></svg>`;
}

const FA_PATHS = {
  phone: 'M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z',
  envelope: 'M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z',
  link: 'M562.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L405.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C189.5 251.2 196 330 246 380c56.5 56.5 148 56.5 204.5 0L562.8 267.7zM43.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C57 371.7 57 320.7 88.5 289.2L174.9 202.8c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.8l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C370.5 260.8 364 182 314 132c-56.5-56.5-148-56.5-204.5 0L43.2 244.3z',
};

// ── UTM helper ───────────────────────────────────────────────────────────────

function buildUtmString(fields: SignatureFields): string {
  if (!fields.trackingEnabled) return '';
  const params: string[] = [];
  if (fields.utmSource) params.push(`utm_source=${encodeURIComponent(fields.utmSource)}`);
  if (fields.utmMedium) params.push(`utm_medium=${encodeURIComponent(fields.utmMedium)}`);
  if (fields.utmCampaign) params.push(`utm_campaign=${encodeURIComponent(fields.utmCampaign)}`);
  if (fields.utmContent) params.push(`utm_content=${encodeURIComponent(fields.utmContent)}`);
  return params.length > 0 ? `?${params.join('&')}` : '';
}

function appendUtm(url: string, utmString: string): string {
  if (!utmString || !url) return url;
  // Don't double-append if UTM already present
  if (url.includes('utm_')) return url;
  // If URL already has query params, use & instead of ?
  const separator = url.includes('?') ? '&' : '?';
  return url + separator + utmString.replace(/^\?/, '');
}

// ── Main export ──────────────────────────────────────────────────────────────

export function generateSignatureHtml(fields: SignatureFields): string {
  const {
    fullName, jobTitle, phone, email, website,
    ctaText, ctaUrl, photoUrl, logoUrl, accentColor, companyName,
    confidentialityEnabled, confidentialityText,
  } = fields;

  const photoSrc = photoUrl || 'https://placehold.co/90x90/cccccc/555555?text=Photo';
  const logoSrc = logoUrl || `https://placehold.co/120x30/ffffff/333333?text=${encodeURIComponent(companyName || 'Company')}`;

  const utmString = buildUtmString(fields);
  const trackedWebsite = appendUtm(website, utmString);
  const trackedCtaUrl = appendUtm(ctaUrl, utmString);

  const iconColor = '#5cb85c';
  const phoneIcon = svgIcon(FA_PATHS.phone, iconColor);
  const envelopeIcon = svgIcon(FA_PATHS.envelope, iconColor);
  const linkIcon = svgIcon(FA_PATHS.link, iconColor);

  // Confidentiality clause block (only rendered when enabled and text is present)
  const clauseBlock = confidentialityEnabled && confidentialityText.trim()
    ? `
  <!-- Confidentiality Clause -->
  <tr>
    <td style="padding:12px 0 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding:10px 0 0 0;border-top:1px solid #e8e8e8;">
            <p style="margin:0;font-size:9px;line-height:1.5;color:#999999;font-style:italic;font-family:Arial,Helvetica,sans-serif;">${confidentialityText.replace(/\n/g, '<br/>')}</p>
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

<table width="600" cellpadding="0" cellspacing="0" border="0"
  style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222222;background-color:#ffffff;max-width:600px;">

  <!-- Separator -->
  <tr>
    <td style="padding:0 0 8px 0;color:#999999;font-size:12px;">--</td>
  </tr>

  <!-- Top border -->
  <tr>
    <td style="padding:0;height:1px;background-color:#e0e0e0;font-size:0;line-height:0;">&nbsp;</td>
  </tr>

  <!-- Main row -->
  <tr>
    <td style="padding:16px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>

          <!-- LEFT COLUMN -->
          <td width="320" valign="middle" style="padding:0 20px 0 0;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr valign="middle">

                <!-- Photo -->
                <td style="padding:0 16px 0 0;">
                  <img src="${photoSrc}" alt="${fullName}"
                    style="display:block;border-radius:50%;border:0;object-fit:cover;width:90px;height:90px;max-width:90px;max-height:90px;" />
                </td>

                <!-- Name / Title / Logo -->
                <td valign="middle" style="padding:0;">
                  <p style="margin:0 0 4px 0;font-size:15px;font-weight:bold;color:#111111;white-space:nowrap;">${fullName}</p>
                  <p style="margin:0 0 10px 0;font-size:13px;font-weight:normal;color:#222222;display:inline-block;">
                    <span style="background-color:${accentColor};padding:1px 4px;display:inline-block;">${jobTitle}</span>
                  </p>
                  <p style="margin:20px 0 0 0;">
                    <img src="${logoSrc}" alt="${companyName}"
                      style="display:block;border:0;max-width:200px;max-height:60px;width:auto;height:auto;" />
                  </p>
                </td>

              </tr>
            </table>
          </td>

          <!-- DIVIDER -->
          <td width="1" style="background-color:#cccccc;padding:0;font-size:0;line-height:0;">&nbsp;</td>

          <!-- RIGHT COLUMN -->
          <td valign="middle" style="padding:0 0 0 24px;">
            <table cellpadding="0" cellspacing="0" border="0">

              <!-- Phone -->
              <tr>
                <td style="padding:0 0 8px 0;white-space:nowrap;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
                    <td width="26" style="padding:0 8px 0 0;text-align:center;">${phoneIcon}</td>
                    <td><a href="tel:${phone.replace(/\s/g, '')}" style="color:#222222;text-decoration:underline;font-size:13px;">${phone}</a></td>
                  </tr></table>
                </td>
              </tr>

              <!-- Email -->
              <tr>
                <td style="padding:0 0 8px 0;white-space:nowrap;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
                    <td width="26" style="padding:0 8px 0 0;text-align:center;">${envelopeIcon}</td>
                    <td><a href="mailto:${email}" style="color:#222222;text-decoration:underline;font-size:13px;">${email}</a></td>
                  </tr></table>
                </td>
              </tr>

              <!-- Website -->
              <tr>
                <td style="padding:0 0 12px 0;white-space:nowrap;">
                  <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
                    <td width="26" style="padding:0 8px 0 0;text-align:center;">${linkIcon}</td>
                    <td><a href="${trackedWebsite}" target="_blank" style="color:#222222;text-decoration:underline;font-size:13px;">${website}</a></td>
                  </tr></table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0;">
                  <a href="${trackedCtaUrl}" target="_blank"
                    style="color:#111111;text-decoration:underline;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">${ctaText}</a>
                </td>
              </tr>

            </table>
          </td>

        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom dashed border -->
  <tr>
    <td style="padding:0;height:1px;border-top:1px dashed #cccccc;font-size:0;line-height:0;">&nbsp;</td>
  </tr>
${clauseBlock}
</table>

</body>
</html>`;
}
