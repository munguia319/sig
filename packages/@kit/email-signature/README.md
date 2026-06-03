# @kit/email-signature

Email Signature Builder for MakerKit (Next.js + Supabase Turbo).

Six production-ready email signature templates with a live preview editor, team signature management, and 7-day shareable review links. All signatures are table-based HTML compatible with Gmail, Outlook 2016/2019/365, Apple Mail, and HubSpot.

---

## Setup (5 steps, ~4–5 hours total)

### 1. Copy the package into your monorepo

```bash
cp -r packages/@kit/email-signature packages/@kit/email-signature
```

Add to `apps/web/package.json`:

```json
{ "dependencies": { "@kit/email-signature": "workspace:*" } }
```

Then:

```bash
pnpm install
```

### 2. Import the styles

In `apps/web/src/app/globals.css` (or your global stylesheet):

```css
@import '@kit/email-signature/styles';
```

This imports the utility classes (`sidebar-shell`, `accordion-section`, `toggle-track`, etc.) that the components depend on. These classes use Inter font and MakerKit's gray/white palette.

### 3. Run the Supabase migration

```bash
supabase db push
```

Or paste `supabase/migrations/001_email_signatures.sql` into the Supabase SQL Editor.

Creates:
- `email_signatures` — one row per employee signature per team, with RLS
- `public_signature_links` — 7-day shareable preview tokens, with RLS

### 4. Copy the page stubs

Copy these files into your `apps/web/app/` directory:

```
apps/web/app/home/[account]/signature/page.tsx        ← Gallery
apps/web/app/home/[account]/signature/editor/page.tsx ← Editor
apps/web/app/share/[token]/page.tsx                   ← Public share
```

Each stub has a commented-out production implementation ready to uncomment.

### 5. Add to the team sidebar navigation

In `apps/web/config/team-account-navigation.config.tsx`:

```tsx
import { PenLine } from 'lucide-react';

// Add to the navigation items array:
{
  label: 'Email Signatures',
  path: createPath('/home/[account]/signature', { account }),
  Icon: <PenLine className="w-4 h-4" />,
}
```

---

## Wiring SignatureContext to Supabase

`SignatureContext.tsx` currently uses `useState` + `localStorage` for the employee list (mock state from the prototype). Replace the `employees`, `saveEmployee`, `deleteEmployee`, and `loadEmployee` implementations:

```tsx
// Load all signatures for the team
const { data: employees } = await supabase
  .from('email_signatures')
  .select('*')
  .eq('account_id', accountId)
  .order('updated_at', { ascending: false });

// Save / update a signature
await supabase.from('email_signatures').upsert({
  id: activeEmployeeId ?? undefined,
  account_id: accountId,
  employee_name: fields.fullName,
  template_id: fields.activeTemplate,
  fields,
  updated_at: new Date().toISOString(),
});

// Delete a signature
await supabase.from('email_signatures').delete().eq('id', employeeId);
```

---

## Wiring the Share Button (7-day links)

Create a Route Handler at `apps/web/app/api/signature-links/route.ts`:

```ts
import { enhanceRouteHandler } from '@kit/next/routes';
import { createSupabaseServerClient } from '@kit/supabase/server-client';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

export const POST = enhanceRouteHandler(async ({ body, user }) => {
  const supabase = createSupabaseServerClient();
  const token = nanoid(12);
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('public_signature_links').insert({
    token, html: body.html, account_id: body.accountId, expires_at,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`,
    expires_at,
  });
});
```

Then update `ShareButton.tsx` to call `POST /api/signature-links` instead of using `sessionStorage`.

---

## Templates

| Template | Layout | Key Features |
|---|---|---|
| **The Opensend** | Two-column | Circular photo, highlighted job title, contact icons |
| **The Foley** | Single-column | Bold name, italic title, pipe-separated links, logo |
| **The Storysnap** | Single-column | Logo on top, brands line, CTA, colored HR |
| **The Squaxe** | Three-column | Social icons, circular photo, contact, banner image |
| **The Dozer** | Single-column | HRs, cell/office phone, promo text, social icons |
| **The Johnson** | Two-column | Circular photo with brand border, brand-color HR, 5 social icons |

To add a new template:
1. Create `src/lib/generateNewTemplateHtml.ts`
2. Add defaults to `src/contexts/SignatureContext.tsx`
3. Create `src/components/NewTemplateSidebar.tsx`
4. Add to `src/lib/templates.ts`
5. Add a case in `src/components/SignaturePreview.tsx` and `MobilePreview.tsx`

---

## File Structure

```
packages/@kit/email-signature/
├── package.json
├── README.md                         ← You are here
└── src/
    ├── email-signature.css           ← Import in globals.css
    ├── lib/
    │   ├── generateSignatureHtml.ts  ← The Opensend
    │   ├── generateFoleyHtml.ts
    │   ├── generateStorysnapHtml.ts
    │   ├── generateSquaxeHtml.ts
    │   ├── generateDozerHtml.ts
    │   ├── generateJohnsonHtml.ts
    │   └── templates.ts              ← Gallery registry
    ├── components/
    │   ├── SignaturePreview.tsx       ← Live preview (desktop + mobile)
    │   ├── MobileEditor.tsx
    │   ├── MobilePreview.tsx
    │   ├── ShareButton.tsx
    │   ├── EmployeeList.tsx
    │   ├── SignatureSidebar.tsx       ← The Opensend sidebar
    │   ├── FoleySidebar.tsx
    │   ├── StorysnapSidebar.tsx
    │   ├── SquaxeSidebar.tsx
    │   ├── DozerSidebar.tsx
    │   └── JohnsonSidebar.tsx
    └── contexts/
        └── SignatureContext.tsx       ← Replace mock state with Supabase

apps/web/app/
├── home/[account]/signature/
│   ├── page.tsx                      ← Gallery stub (uncomment implementation)
│   └── editor/page.tsx               ← Editor stub (uncomment implementation)
└── share/[token]/page.tsx            ← Public share (reads Supabase server-side)

supabase/migrations/
└── 001_email_signatures.sql          ← Run this first
```

---

## Estimated Integration Time

| Task | Time |
|---|---|
| Copy files + `pnpm install` | 15 min |
| Import CSS + run migration | 10 min |
| Copy page stubs + add sidebar nav | 30 min |
| Replace mock state with Supabase | 2–3 hrs |
| Wire Share button API route | 1 hr |
| **Total** | **~4–5 hrs** |
