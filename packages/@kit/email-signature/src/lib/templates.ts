/**
 * templates.ts
 * =============
 * Central registry of all available email signature templates.
 *
 * Each template defines:
 *   - id:          URL-safe slug used in routing (/editor?template=the-octopus)
 *   - name:        Display name shown in gallery and modal
 *   - description: Short description shown in the modal
 *   - previewHtml: The raw HTML string rendered in the card/modal preview iframe
 *   - tags:        Optional labels (e.g. "Professional", "Minimal")
 *
 * To add a new template:
 *   1. Add a new entry to the TEMPLATES array below
 *   2. Provide the previewHtml (can be a static string or generated via generateSignatureHtml)
 *   3. The gallery will automatically display it
 */

export interface Template {
  id: string;
  name: string;
  description: string;
  previewHtml: string;
  tags: string[];
}

// ── Template 1: The Opensend ─────────────────────────────────────────────────
// The two-column layout built in this project.

const OPENSEND_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222;background:#fff;max-width:560px;">
  <tr><td style="padding:0 0 6px 0;color:#999;font-size:11px;">--</td></tr>
  <tr><td style="padding:0;height:1px;background:#e0e0e0;font-size:0;line-height:0;">&nbsp;</td></tr>
  <tr>
    <td style="padding:14px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
        <td width="280" valign="middle" style="padding:0 16px 0 0;">
          <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
            <td style="padding:0 12px 0 0;">
              <img src="https://placehold.co/80x80/cccccc/555555?text=Photo" alt="Photo" width="80" height="80" style="display:block;border-radius:50%;border:0;"/>
            </td>
            <td valign="middle" style="padding:0;">
              <p style="margin:0 0 3px 0;font-size:14px;font-weight:bold;color:#111;white-space:nowrap;">First Last</p>
              <p style="margin:0 0 8px 0;font-size:12px;color:#222;display:inline-block;">
                <span style="background-color:#c8b84a;padding:1px 4px;display:inline-block;">Web Designer</span>
              </p>
              <p style="margin:0;"><img src="https://placehold.co/100x24/ffffff/333333?text=Company" alt="Company" width="100" height="24" style="display:block;border:0;"/></p>
            </td>
          </tr></table>
        </td>
        <td width="1" style="background:#cccccc;padding:0;font-size:0;line-height:0;">&nbsp;</td>
        <td valign="middle" style="padding:0 0 0 18px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:0 0 6px 0;white-space:nowrap;">
              <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
                <td width="22" style="padding:0 6px 0 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12" fill="#5cb85c"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg></td>
                <td><a href="#" style="color:#222;text-decoration:underline;font-size:12px;">+1 123-456-7890</a></td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:0 0 6px 0;white-space:nowrap;">
              <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
                <td width="22" style="padding:0 6px 0 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12" fill="#5cb85c"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg></td>
                <td><a href="#" style="color:#222;text-decoration:underline;font-size:12px;">name@company.com</a></td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:0 0 10px 0;white-space:nowrap;">
              <table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
                <td width="22" style="padding:0 6px 0 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="12" height="12" fill="#5cb85c"><path d="M562.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L405.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C189.5 251.2 196 330 246 380c56.5 56.5 148 56.5 204.5 0L562.8 267.7zM43.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C57 371.7 57 320.7 88.5 289.2L174.9 202.8c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.8l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C370.5 260.8 364 182 314 132c-56.5-56.5-148-56.5-204.5 0L43.2 244.3z"/></svg></td>
                <td><a href="#" style="color:#222;text-decoration:underline;font-size:12px;">https://company.com</a></td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:0;"><a href="#" style="color:#111;text-decoration:underline;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;">Schedule a Call</a></td></tr>
          </table>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr><td style="padding:0;height:1px;border-top:1px dashed #cccccc;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>
</body></html>`;

// ── Template registry ────────────────────────────────────────────────────────

const FOLEY_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222;background:#fff;max-width:520px;">
  <tr><td style="padding:0 0 2px 0;"><p style="margin:0;font-size:15px;font-weight:bold;color:#1a6abf;">First Last</p></td></tr>
  <tr><td style="padding:0 0 12px 0;"><p style="margin:0;font-size:12px;font-style:italic;color:#333;">Web Designer</p></td></tr>
  <tr><td style="padding:0 0 3px 0;"><p style="margin:0;"><a href="#" style="font-size:12px;font-weight:bold;color:#1a6abf;text-decoration:none;">Company Name</a></p></td></tr>
  <tr><td style="padding:0 0 3px 0;"><p style="margin:0;font-size:12px;color:#333;">1234 Street Address, City, ST 00000</p></td></tr>
  <tr><td style="padding:0 0 8px 0;"><p style="margin:0;font-size:12px;color:#333;">Phone 123-456-7890</p></td></tr>
  <tr><td style="padding:0 0 14px 0;"><p style="margin:0;font-size:12px;line-height:1.6;"><a href="#" style="color:#1a6abf;text-decoration:none;">View My Bio</a><span style="color:#999;padding:0 5px;">|</span><a href="#" style="color:#1a6abf;text-decoration:none;">Visit company.com</a><span style="color:#999;padding:0 5px;">|</span><a href="#" style="color:#1a6abf;text-decoration:none;">Follow us on LinkedIn</a><span style="color:#999;padding:0 5px;">|</span><a href="#" style="color:#1a6abf;text-decoration:none;">name@company.com</a></p></td></tr>
  <tr><td style="padding:0;"><img src="https://placehold.co/180x54/ffffff/333333?text=FOLEY" alt="Foley" width="180" height="54" style="display:block;border:0;"/></td></tr>
</table>
</body></html>`;

const STORYSNAP_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="440" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222;background:#fff;max-width:440px;">
  <tr><td style="padding:0 0 10px 0;"><img src="https://placehold.co/140x36/ffffff/333333?text=Logo" alt="Logo" width="140" height="36" style="display:block;border:0;"/></td></tr>
  <tr><td style="padding:0 0 2px 0;"><p style="margin:0;font-size:13px;font-weight:bold;color:#111;">First Last</p></td></tr>
  <tr><td style="padding:0 0 2px 0;"><p style="margin:0;font-size:12px;color:#333;">Web Designer - Company</p></td></tr>
  <tr><td style="padding:0 0 4px 0;"><p style="margin:0;font-size:12px;color:#333;">Brands: Brand One &amp; Brand Two</p></td></tr>
  <tr><td style="padding:0 0 10px 0;"><a href="#" style="font-size:12px;color:#333;text-decoration:underline;">See why proof beats persuasion</a></td></tr>
  <tr><td style="padding:0 0 10px 0;"><table cellpadding="0" cellspacing="0" border="0" width="260"><tr><td style="height:1px;background-color:#e8417a;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
  <tr><td style="padding:0 0 6px 0;"><table cellpadding="0" cellspacing="0" border="0"><tr valign="middle"><td width="22" style="padding:0 6px 0 0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12" style="display:inline-block;vertical-align:middle;border:1.5px solid #e8417a;border-radius:3px;padding:1px;" fill="#e8417a"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg></td><td><span style="font-size:12px;color:#333;">name@company.com</span></td></tr></table></td></tr>
  <tr><td style="padding:0;"><table cellpadding="0" cellspacing="0" border="0"><tr valign="middle"><td width="22" style="padding:0 6px 0 0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12" style="display:inline-block;vertical-align:middle;border:1.5px solid #e8417a;border-radius:50%;padding:1px;" fill="#e8417a"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.5 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.5-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg></td><td><span style="font-size:12px;color:#333;">www.company.com</span></td></tr></table></td></tr>
</table>
</body></html>`;

const SQUAXE_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;background:#fff;max-width:520px;">
  <tr>
    <td width="28" valign="top" style="padding:2px 10px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:0 0 7px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14" fill="#888"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg></td></tr>
        <tr><td style="padding:0 0 7px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14" fill="#888"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48z"/></svg></td></tr>
        <tr><td style="padding:0 0 7px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="14" height="14" fill="#888"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg></td></tr>
        <tr><td style="padding:0 0 7px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="14" height="14" fill="#888"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></td></tr>
        <tr><td style="padding:0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="14" height="14" fill="#888"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg></td></tr>
      </table>
    </td>
    <td width="90" valign="top" style="padding:0 14px 0 0;">
      <img src="https://placehold.co/80x80/cccccc/555555?text=Photo" alt="Photo" width="80" height="80" style="display:block;border-radius:50%;border:0;"/>
    </td>
    <td valign="top" style="padding:0;">
      <p style="margin:0 0 5px 0;"><strong style="font-size:13px;color:#111;">First Last</strong>&nbsp;&nbsp;<em style="font-size:12px;color:#888;font-weight:normal;">Web Designer</em></p>
      <p style="margin:0 0 3px 0;font-size:11px;color:#888;">name@company.com&nbsp;&nbsp;<span style="color:#ccc;">|</span>&nbsp;&nbsp;123-456-7890</p>
      <p style="margin:0 0 3px 0;font-size:11px;color:#888;">www.company.com</p>
      <p style="margin:0 0 8px 0;font-size:11px;color:#888;">1234 Street Address, City, ST 00000</p>
      <img src="https://placehold.co/100x34/ffffff/333333?text=Logo" alt="Logo" width="100" height="34" style="display:block;border:0;"/>
    </td>
  </tr>
  <tr><td colspan="3" style="padding:10px 0;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:#e0e0e0;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
  <tr><td colspan="3" style="padding:0;"><img src="https://placehold.co/520x80/e8e8e8/888888?text=IMG" alt="Banner" width="520" style="display:block;border:0;width:100%;"/></td></tr>
</table>
</body></html>`;

const DOZER_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;background:#fff;max-width:500px;">
  <tr><td style="padding:0 0 8px 0;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:#cccccc;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
  <tr><td style="padding:0 0 6px 0;"><p style="margin:0;"><strong style="font-size:18px;color:#111;">First Last</strong>&nbsp;&nbsp;&nbsp;<span style="font-size:14px;color:#888;">Web Designer</span></p></td></tr>
  <tr><td style="padding:0 0 10px 0;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:#cccccc;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
  <tr><td style="padding:0 0 5px 0;"><p style="margin:0;font-size:12px;color:#333;">cell: (123-456-7890</p></td></tr>
  <tr><td style="padding:0 0 5px 0;"><p style="margin:0;font-size:12px;color:#333;">office: (123-456-7890 ext 000</p></td></tr>
  <tr><td style="padding:0 0 5px 0;"><a href="#" style="font-size:12px;color:#cc44cc;text-decoration:none;">name@company.com</a></td></tr>
  <tr><td style="padding:0 0 5px 0;"><a href="#" style="font-size:12px;color:#333;text-decoration:none;">www.company.com</a></td></tr>
  <tr><td style="padding:0 0 10px 0;"><p style="margin:0;font-size:12px;font-style:italic;color:#333;">Custom text or promo copy here with a <a href="#" style="color:#cc44cc;text-decoration:underline;font-style:italic;">link</a> with the ability to add a hyper link</p></td></tr>
  <tr><td style="padding:0 0 10px 0;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:1px;background:#cccccc;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
  <tr><td style="padding:0;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr valign="middle">
    <td valign="middle"><table cellpadding="0" cellspacing="0" border="0"><tr valign="middle">
      <td style="padding:0 10px 0 0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="#888"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></td>
      <td style="padding:0 10px 0 0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="#888"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48z"/></svg></td>
      <td style="padding:0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" fill="#888"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg></td>
    </tr></table></td>
    <td valign="middle" style="text-align:right;"><img src="https://placehold.co/140x55/e0e0e0/888888?text=Logo+IMG" alt="Logo" width="140" height="55" style="display:block;border:0;margin-left:auto;"/></td>
  </tr></table></td></tr>
</table>
</body></html>`;

const JOHNSON_PREVIEW_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:480px;background:#ffffff;">
  <tr>
    <td style="padding-right:14px;vertical-align:top;">
      <img src="https://placehold.co/70x70/eeeeee/999999?text=Photo" alt="Photo" style="border-radius:50%;display:block;border:2px solid #EC654E;width:70px;height:70px;max-width:70px;max-height:70px;"/>
    </td>
    <td style="vertical-align:top;border-left:1px solid #dddddd;padding-left:14px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td colspan="2" style="padding-bottom:2px;"><span style="font-size:14px;font-weight:700;color:#1a1a1a;">First Last</span></td></tr>
        <tr><td colspan="2" style="padding-bottom:5px;"><span style="font-size:11px;color:#EC654E;font-weight:600;">Web Designer</span><span style="font-size:11px;color:#888;"> &bull; Creative</span></td></tr>
        <tr><td colspan="2" style="padding:6px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:2px solid #EC654E;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
        <tr><td colspan="2" style="padding-bottom:3px;font-size:11px;font-weight:600;color:#1a1a1a;">Company</td></tr>
        <tr><td colspan="2" style="padding-bottom:2px;font-size:11px;"><a href="#" style="color:#EC654E;text-decoration:none;">name@company.com</a></td></tr>
        <tr><td colspan="2" style="padding-bottom:2px;font-size:11px;color:#444;">123-456-7890</td></tr>
        <tr><td colspan="2" style="padding-bottom:2px;font-size:11px;"><a href="#" style="color:#EC654E;text-decoration:none;">company.com</a></td></tr>
        <tr><td colspan="2" style="padding-top:3px;font-size:10px;color:#888;">1234 Street Address, City, ST 00000</td></tr>
        <tr><td colspan="2" style="padding:16px 0 0 0;"><img src="https://placehold.co/100x30/eeeeee/999999?text=Logo" alt="Logo" style="display:block;max-width:100px;max-height:30px;width:auto;height:auto;"/></td></tr>
        <tr><td colspan="2" style="padding-top:8px;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" style="display:inline-block;vertical-align:middle;margin-right:6px;" fill="#EC654E"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" style="display:inline-block;vertical-align:middle;" fill="#EC654E"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
        </td></tr>
      </table>
    </td>
  </tr>
</table>
</body></html>`;

export const TEMPLATES: Template[] = [
  {
    id: 'the-opensend',
    name: 'The Opensend',
    description: 'A clean two-column layout with circular headshot, highlighted job title, company logo, and contact details with inline icons. Ideal for sales and business development teams.',
    previewHtml: OPENSEND_PREVIEW_HTML,
    tags: ['Professional', 'Two-Column', 'Icons'],
  },
  {
    id: 'the-foley',
    name: 'The Foley',
    description: 'A single-column professional layout with bold name, italic title, company link, address, phone, pipe-separated links row, and logo. Ideal for law firms, financial services, and corporate teams that need a clean, text-forward signature with optional confidentiality notice.',
    previewHtml: FOLEY_PREVIEW_HTML,
    tags: ['Professional', 'Single-Column', 'Legal', 'Corporate'],
  },
  {
    id: 'the-storysnap',
    name: 'The Storysnap',
    description: 'A minimal single-column layout with logo above the name, bold name, title and company on one line, optional brands line, CTA link, a colored horizontal rule, and icon-prefixed email and website rows. A single brand color controls the rule, icons, and link color.',
    previewHtml: STORYSNAP_PREVIEW_HTML,
    tags: ['Minimal', 'Single-Column', 'Modern'],
  },
  {
    id: 'the-squaxe',
    name: 'The Squaxe',
    description: 'A three-column layout with a vertical social icon stack on the left, a circular headshot in the center, and name, title, contact details, and a bordered logo on the right. Below the signature a full-width horizontal rule separates a clickable banner image. Includes a confidentiality clause section below the banner.',
    previewHtml: SQUAXE_PREVIEW_HTML,
    tags: ['Social', 'Three-Column', 'Banner', 'Corporate'],
  },
  {
    id: 'the-dozer',
    name: 'The Dozer',
    description: 'A clean single-column layout framed by horizontal rules. Features bold name with gray title, cell and office phone lines, brand-color email link, website, italic promo text with a hyperlink, then a bottom rule separating a row of social icons on the left and a logo image on the right. Includes a confidentiality clause below.',
    previewHtml: DOZER_PREVIEW_HTML,
    tags: ['Minimal', 'Single-Column', 'Social', 'Promo'],
  },
  {
    id: 'the-johnson',
    name: 'The Johnson',
    description: 'A two-column layout with a circular photo (brand-color border) on the left and contact details on the right, separated by a vertical rule. Features bold name, brand-color job title with department, an orange horizontal rule, company name, email, phone, website, address, logo, and social icons.',
    previewHtml: JOHNSON_PREVIEW_HTML,
    tags: ['Professional', 'Two-Column', 'Social', 'Photo'],
  },
];
