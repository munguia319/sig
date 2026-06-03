/**
 * SignatureSidebar
 * ================
 * Three collapsible accordion sections:
 *   1. General Info & Assets  (open by default)
 *   2. Confidentiality Clause (toggle + textarea)
 *   3. Tracking Parameters    (toggle + UTM fields)
 *
 * Save / Download / Copy buttons are always pinned at the bottom.
 */

import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { generateSignatureHtml } from '@kit/email-signature/lib/generateSignatureHtml';
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileSignature,
  Link2,
  Lock,
  Plus,
  Save,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@kit/ui/sonner';

// ── Shared primitives ────────────────────────────────────────────────────────

function FieldRow({
  label, id, value, onChange, placeholder, type = 'text',
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="field-label block mb-1">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#e5e7eb] rounded px-2.5 py-1.5 text-[13px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 transition-colors"
      />
    </div>
  );
}

function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className="relative w-8 h-4 rounded-full transition-colors"
        style={{ backgroundColor: checked ? '#111111' : '#e5e7eb' }}
      >
        <div
          className={`toggle-thumb ${checked ? 'toggle-thumb-on' : 'toggle-thumb-off'}`}
        />
      </div>
      <span className="text-[12px] text-[#555555]">{label}</span>
    </label>
  );
}

// ── Accordion section ────────────────────────────────────────────────────────

function AccordionSection({
  icon, title, badge, defaultOpen = false, children,
}: {
  icon: React.ReactNode; title: string; badge?: string;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion-section">
      <button
        onClick={() => setOpen((v) => !v)}
        className="accordion-trigger"
      >
        <span className="icon-muted">{icon}</span>
        <span className="flex-1 text-[13px] font-semibold text-[#1a1a1a]">{title}</span>
        {badge && (
          <span className="section-badge">
            {badge}
          </span>
        )}
        {open
          ? <ChevronDown size={14} className="text-[#aaaaaa] shrink-0" />
          : <ChevronRight size={14} className="text-[#aaaaaa] shrink-0" />}
      </button>
      {open && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function SignatureSidebar() {
  const { fields, setField, saveEmployee, isDirty, newEmployee, activeEmployeeId } = useSignature();

  function handleDownload() {
    const html = generateSignatureHtml(fields);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(fields.fullName || 'signature').replace(/\s+/g, '-').toLowerCase()}-email-signature.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('HTML file downloaded');
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateSignatureHtml(fields))
      .then(() => toast.success('Raw HTML copied to clipboard'))
      .catch(() => toast.error('Could not copy to clipboard'));
  }

  // Count active tracking params for badge
  const activeUtm = [fields.utmSource, fields.utmMedium, fields.utmCampaign, fields.utmContent]
    .filter(Boolean).length;

  return (
    <aside className="sidebar-shell">

      {/* Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-2 mb-1">
          <FileSignature size={16} className="icon-muted" />
          <span className="text-[#1a1a1a] font-semibold text-sm tracking-tight">Signature Editor</span>
        </div>
        <p className="text-[#888888] text-[11px] font-mono">
          {activeEmployeeId ? `Editing: ${fields.fullName || 'Untitled'}` : 'New signature'}
        </p>
      </div>

      {/* Scrollable accordion sections */}
      <div className="sidebar-scroll">

        {/* ── Section 1: General Info & Assets ── */}
        <AccordionSection
          icon={<User size={14} />}
          title="General Info & Assets"
          defaultOpen={true}
        >
          <p className="field-section-label">Identity</p>
          <FieldRow label="Full Name" id="fullName" value={fields.fullName} onChange={(v) => setField('fullName', v)} placeholder="Jane Smith" />
          <FieldRow label="Job Title" id="jobTitle" value={fields.jobTitle} onChange={(v) => setField('jobTitle', v)} placeholder="Account Executive" />
          <FieldRow label="Company Name" id="companyName" value={fields.companyName} onChange={(v) => setField('companyName', v)} placeholder="Acme Corp" />

          <div className="sidebar-section">
            <p className="field-section-label">Contact</p>
            <FieldRow label="Phone" id="phone" value={fields.phone} onChange={(v) => setField('phone', v)} placeholder="+1 555-000-0000" type="tel" />
            <FieldRow label="Email Address" id="email" value={fields.email} onChange={(v) => setField('email', v)} placeholder="jane@company.com" type="email" />
            <FieldRow label="Website URL" id="website" value={fields.website} onChange={(v) => setField('website', v)} placeholder="https://company.com" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Call to Action</p>
            <FieldRow label="CTA Label" id="ctaText" value={fields.ctaText} onChange={(v) => setField('ctaText', v)} placeholder="Schedule a Call" />
            <FieldRow label="CTA URL" id="ctaUrl" value={fields.ctaUrl} onChange={(v) => setField('ctaUrl', v)} placeholder="https://calendly.com/..." />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Assets</p>
            <FieldRow label="Photo URL" id="photoUrl" value={fields.photoUrl} onChange={(v) => setField('photoUrl', v)} placeholder="https://... (90×90 px square)" />
            <FieldRow label="Logo URL" id="logoUrl" value={fields.logoUrl} onChange={(v) => setField('logoUrl', v)} placeholder="https://... (120×30 px PNG)" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Style</p>
            <div className="mb-1">
              <label htmlFor="accentColor" className="field-label block mb-1">Accent / Highlight Color</label>
              <div className="flex items-center gap-2">
                <input
                  id="accentColor" type="color" value={fields.accentColor}
                  onChange={(e) => setField('accentColor', e.target.value)}
                  className="w-8 h-8 rounded border border-[#e5e7eb] bg-white cursor-pointer p-0.5"
                />
                <span className="text-[#888888] text-[12px] font-mono">{fields.accentColor}</span>
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* ── Section 2: Confidentiality Clause ── */}
        <AccordionSection
          icon={<Lock size={14} />}
          title="Confidentiality Clause"
          badge={fields.confidentialityEnabled ? 'ON' : undefined}
        >
          <div className="mb-3">
            <Toggle
              checked={fields.confidentialityEnabled}
              onChange={(v) => setField('confidentialityEnabled', v)}
              label="Append confidentiality notice to signature"
            />
          </div>

          {fields.confidentialityEnabled && (
            <div className="mt-3">
              <label htmlFor="confidentialityText" className="field-label block mb-1">
                Clause Text
              </label>
              <textarea
                id="confidentialityText"
                value={fields.confidentialityText}
                onChange={(e) => setField('confidentialityText', e.target.value)}
                placeholder="Paste your confidentiality or privacy notice here..."
                rows={6}
                className="w-full bg-white border border-[#e5e7eb] rounded px-2.5 py-1.5 text-[12px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 transition-colors resize-y leading-relaxed"
              />
              <p className="text-[10px] text-[#aaaaaa] font-mono mt-1">
                Renders as small italic text below the signature divider.
              </p>
            </div>
          )}

          {!fields.confidentialityEnabled && (
            <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">
              Enable to append a legal confidentiality or privacy notice below every signature.
            </p>
          )}
        </AccordionSection>

        {/* ── Section 3: Tracking Parameters ── */}
        <AccordionSection
          icon={<Link2 size={14} />}
          title="Tracking Parameters"
          badge={fields.trackingEnabled && activeUtm > 0 ? `${activeUtm} param${activeUtm > 1 ? 's' : ''}` : undefined}
        >
          <div className="mb-3">
            <Toggle
              checked={fields.trackingEnabled}
              onChange={(v) => setField('trackingEnabled', v)}
              label="Append UTM parameters to all links"
            />
          </div>

          {fields.trackingEnabled && (
            <div className="mt-3 space-y-0">
              <p className="text-[11px] text-[#888888] mb-3 leading-relaxed">
                These parameters will be appended to the website URL, CTA link, and any other URLs in the signature.
              </p>
              <FieldRow label="utm_source" id="utmSource" value={fields.utmSource} onChange={(v) => setField('utmSource', v)} placeholder="email" />
              <FieldRow label="utm_medium" id="utmMedium" value={fields.utmMedium} onChange={(v) => setField('utmMedium', v)} placeholder="signature" />
              <FieldRow label="utm_campaign" id="utmCampaign" value={fields.utmCampaign} onChange={(v) => setField('utmCampaign', v)} placeholder="q1-outreach" />
              <FieldRow label="utm_content" id="utmContent" value={fields.utmContent} onChange={(v) => setField('utmContent', v)} placeholder="cta-button" />

              {/* Live preview of the appended string */}
              {(fields.utmSource || fields.utmMedium || fields.utmCampaign || fields.utmContent) && (
                <div className="mt-2 bg-[#f9f9f9] border border-[#e5e7eb] rounded px-2.5 py-2">
                  <p className="field-label mb-1">Preview</p>
                  <p className="text-[10px] font-mono text-[#555555] break-all leading-relaxed">
                    ?{[
                      fields.utmSource && `utm_source=${encodeURIComponent(fields.utmSource)}`,
                      fields.utmMedium && `utm_medium=${encodeURIComponent(fields.utmMedium)}`,
                      fields.utmCampaign && `utm_campaign=${encodeURIComponent(fields.utmCampaign)}`,
                      fields.utmContent && `utm_content=${encodeURIComponent(fields.utmContent)}`,
                    ].filter(Boolean).join('&')}
                  </p>
                </div>
              )}
            </div>
          )}

          {!fields.trackingEnabled && (
            <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">
              Enable to automatically append UTM tracking parameters to all links in the signature for analytics.
            </p>
          )}
        </AccordionSection>

      </div>

      {/* Footer — always visible */}
      <div className="sidebar-footer">
        <button
          onClick={saveEmployee}
          className="btn-orange w-full flex items-center justify-center gap-2 rounded px-3 py-2 text-sm"
        >
          <Save size={14} />
          Save
          {isDirty && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            <Download size={13} />
            Download HTML
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            Copy HTML
          </button>
        </div>

        <button
          onClick={newEmployee}
          className="w-full flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium text-[#aaaaaa] hover:text-[#111111] transition-colors"
        >
          <Plus size={13} />
          Start Over
        </button>
      </div>
    </aside>
  );
}
