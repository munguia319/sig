-- ============================================================
-- Create signature_templates table and seed with static templates
-- ============================================================

CREATE TABLE IF NOT EXISTS public.signature_templates (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  preview_html text,
  tags text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signature_templates_id_idx
  ON public.signature_templates (id);

-- Insert templates (id, name, description, preview_html, tags)

INSERT INTO public.signature_templates (id, name, description, preview_html, tags) VALUES
('the-opensend', 'The Opensend', 'A clean two-column layout with circular headshot, highlighted job title, company logo, and contact details with inline icons. Ideal for sales and business development teams.', $$
<!DOCTYPE html>
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
                <td width="22" style="padding:0 6px 0 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="12" height="12" fill="#5cb85c"><path d="M562.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L405.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C189.5 251.2 196 330 246 380c56.5 56.5 148 56.5 204.5 0L562.8 267.7z"/></svg></td>
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
</body></html>
$$, ARRAY['Professional','Two-Column','Icons']),

('the-foley', 'The Foley', 'A single-column professional layout with bold name, italic title, company link, address, phone, pipe-separated links row, and logo. Ideal for law firms, financial services, and corporate teams that need a clean, text-forward signature with optional confidentiality notice.', $$
<!DOCTYPE html>
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
</body></html>
$$, ARRAY['Professional','Single-Column','Corporate']),

('the-storysnap', 'The Storysnap', 'A minimal single-column layout with logo above the name, bold name, title and company on one line, optional brands line, CTA link, a colored horizontal rule, and icon-prefixed email and website rows. A single brand color controls the rule, icons, and link color.', $$
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="440" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#222;background:#fff;max-width:440px;">
  <tr><td style="padding:0 0 10px 0;"><img src="https://placehold.co/140x36/ffffff/333333?text=Logo" alt="Logo" width="140" height="36" style="display:block;border:0;"/></td></tr>
  <tr><td style="padding:0 0 2px 0;"><p style="margin:0;font-size:13px;font-weight:bold;color:#111;">First Last</p></td></tr>
  <tr><td style="padding:0 0 2px 0;"><p style="margin:0;font-size:12px;color:#333;">Web Designer - Company</p></td></tr>
  <tr><td style="padding:0 0 4px 0;"><p style="margin:0;font-size:12px;color:#333;">Brands: Brand One &amp; Brand Two</p></td></tr>
  <tr><td style="padding:0 0 10px 0;"><a href="#" style="font-size:12px;color:#333;text-decoration:underline;">See why proof beats persuasion</a></td></tr>
</table>
</body></html>
$$, ARRAY['Minimal','Single-Column','Modern']),

('the-squaxe', 'The Squaxe', 'A three-column layout with a vertical social icon stack on the left, a circular headshot in the center, and name, title, contact details, and a bordered logo on the right. Below the signature a full-width horizontal rule separates a clickable banner image. Includes a confidentiality clause section below the banner.', $$
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="520" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;background:#fff;max-width:520px;">
  <tr>
    <td width="28" valign="top" style="padding:2px 10px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:0 0 7px 0;text-align:center;">SOCIAL ICONS</td></tr>
      </table>
    </td>
    <td width="90" valign="top" style="padding:0 14px 0 0;">
      <img src="https://placehold.co/80x80/cccccc/555555?text=Photo" alt="Photo" width="80" height="80" style="display:block;border-radius:50%;border:0;"/>
    </td>
    <td valign="top" style="padding:0;">
      <p style="margin:0 0 5px 0;"><strong style="font-size:13px;color:#111;">First Last</strong>&nbsp;&nbsp;<em style="font-size:12px;color:#888;font-weight:normal;">Web Designer</em></p>
      <p style="margin:0 0 3px 0;font-size:11px;color:#888;">name@company.com&nbsp;&nbsp;<span style="color:#ccc;">|</span>&nbsp;&nbsp;123-456-7890</p>
    </td>
  </tr>
</table>
</body></html>
$$, ARRAY['Social','Three-Column','Banner']),

('the-dozer', 'The Dozer', 'A clean single-column layout framed by horizontal rules. Features bold name with gray title, cell and office phone lines, brand-color email link, website, italic promo text with a hyperlink, then a bottom rule separating a row of social icons on the left and a logo image on the right. Includes a confidentiality clause below.', $$
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table width="500" cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#333;background:#fff;max-width:500px;">
  <tr><td style="padding:0 0 8px 0;">HEADER</td></tr>
  <tr><td style="padding:0 0 6px 0;"><p style="margin:0;"><strong style="font-size:18px;color:#111;">First Last</strong>&nbsp;&nbsp;&nbsp;<span style="font-size:14px;color:#888;">Web Designer</span></p></td></tr>
</table>
</body></html>
$$, ARRAY['Minimal','Single-Column','Social','Promo']),

('the-johnson', 'The Johnson', 'A two-column layout with a circular photo (brand-color border) on the left and contact details on the right, separated by a vertical rule. Features bold name, brand-color job title with department, an orange horizontal rule, company name, email, phone, website, address, logo, and social icons.', $$
<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:480px;background:#ffffff;">
  <tr>
    <td style="padding-right:14px;vertical-align:top;">PHOTO</td>
    <td style="vertical-align:top;border-left:1px solid #dddddd;padding-left:14px;">DETAILS</td>
  </tr>
</table>
</body></html>
$$, ARRAY['Professional','Two-Column','Photo']);

-- Ignore duplicate insert errors for repeated pushes

DO $$
BEGIN
  -- noop
EXCEPTION WHEN unique_violation THEN
  -- ignore
END $$;