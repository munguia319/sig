-- Delete existing (empty) rows and re-insert all templates cleanly
TRUNCATE public.signature_templates;

INSERT INTO public.signature_templates (id, name, description, preview_html, tags) VALUES
('the-opensend', 'The Opensend', 'A clean two-column layout with circular headshot, highlighted job title, company logo, and contact details with inline icons.', '<p>The Opensend Template</p>', ARRAY['Professional','Two-Column','Icons']),
('the-foley', 'The Foley', 'A single-column professional layout with bold name, italic title, company link, address, phone, pipe-separated links row, and logo.', '<p>The Foley Template</p>', ARRAY['Professional','Single-Column','Corporate']),
('the-storysnap', 'The Storysnap', 'A minimal single-column layout with logo above the name, bold name, title and company on one line, optional brands line, and CTA link.', '<p>The Storysnap Template</p>', ARRAY['Minimal','Single-Column','Modern']),
('the-squaxe', 'The Squaxe', 'A three-column layout with a vertical social icon stack on the left, a circular headshot in the center, and contact details on the right.', '<p>The Squaxe Template</p>', ARRAY['Social','Three-Column','Banner']),
('the-dozer', 'The Dozer', 'A clean single-column layout framed by horizontal rules. Features bold name, gray title, cell and office phone lines, and social icons.', '<p>The Dozer Template</p>', ARRAY['Minimal','Single-Column','Social','Promo']),
('the-johnson', 'The Johnson', 'A two-column layout with a circular photo on the left and contact details on the right, separated by a vertical rule.', '<p>The Johnson Template</p>', ARRAY['Professional','Two-Column','Photo']);

NOTIFY pgrst, 'reload schema';
