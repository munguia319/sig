/**
 * MobileEditor
 * =============
 * Mobile-only Edit tab content.
 * Full-height scrollable accordion form with Save / Download / Copy
 * pinned as a sticky footer at the bottom of the viewport.
 */

import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { generateSignatureHtml } from '@kit/email-signature/lib/generateSignatureHtml';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Link2,
  Lock,
  Plus,
  Save,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@kit/ui/sonner';

function FieldRow({
  label, id, value, onChange, placeholder, type = 'text',
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="field-label block mb-1.5">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/15 transition-colors"
      />
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5 rounded-full transition-colors shrink-0"
        style={{ backgroundColor: checked ? '#111111' : '#e5e7eb' }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
        />
      </div>
      <span className="text-[14px] text-[#555555]">{label}</span>
    </label>
  );
}

function AccordionSection({
  icon, title, badge, defaultOpen = false, children,
}: {
  icon: React.ReactNode; title: string; badge?: string;
  defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#f9fafb]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-[#fafafa] transition-colors"
      >
        <span className="icon-muted">{icon}</span>
        <span className="flex-1 text-[15px] font-semibold text-[#1a1a1a]">{title}</span>
        {badge && (
          <span className="section-badge">
            {badge}
          </span>
        )}
        {open
          ? <ChevronDown size={16} className="text-[#aaaaaa] shrink-0" />
          : <ChevronRight size={16} className="text-[#aaaaaa] shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-5 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

export function MobileEditor() {
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

  const activeUtm = [fields.utmSource, fields.utmMedium, fields.utmCampaign, fields.utmContent].filter(Boolean).length;

  // Footer height: Save (~56px) + gap + row (~52px) + padding = ~140px
  const FOOTER_HEIGHT = 140;

  return (
    <div className="w-full" style={{ position: 'relative', height: '100%' }}>

      {/* Scrollable form area — padded at bottom so content clears the fixed footer */}
      <div className="bg-white" style={{ height: '100%', overflowY: 'auto', paddingBottom: `${FOOTER_HEIGHT + 16}px` }}>

        {/* Editing label */}
        <div className="px-4 py-3 border-b border-[#f9fafb] bg-[#fafafa]">
          <p className="text-[11px] text-[#888888] font-mono">
            {activeEmployeeId ? `Editing: ${fields.fullName || 'Untitled'}` : 'New signature'}
          </p>
        </div>

        {/* Section 1: General Info & Assets */}
        <AccordionSection icon={<User size={16} />} title="General Info & Assets" defaultOpen={false}>
          <p className="field-section-label">Identity</p>
          <FieldRow label="Full Name" id="m-fullName" value={fields.fullName} onChange={(v) => setField('fullName', v)} placeholder="Jane Smith" />
          <FieldRow label="Job Title" id="m-jobTitle" value={fields.jobTitle} onChange={(v) => setField('jobTitle', v)} placeholder="Account Executive" />
          <FieldRow label="Company Name" id="m-companyName" value={fields.companyName} onChange={(v) => setField('companyName', v)} placeholder="Acme Corp" />

          <div className="border-t border-[#f9fafb] pt-4 mt-1">
            <p className="field-section-label">Contact</p>
            <FieldRow label="Phone" id="m-phone" value={fields.phone} onChange={(v) => setField('phone', v)} placeholder="+1 555-000-0000" type="tel" />
            <FieldRow label="Email Address" id="m-email" value={fields.email} onChange={(v) => setField('email', v)} placeholder="jane@company.com" type="email" />
            <FieldRow label="Website URL" id="m-website" value={fields.website} onChange={(v) => setField('website', v)} placeholder="https://company.com" />
          </div>

          <div className="border-t border-[#f9fafb] pt-4 mt-1">
            <p className="field-section-label">Call to Action</p>
            <FieldRow label="CTA Label" id="m-ctaText" value={fields.ctaText} onChange={(v) => setField('ctaText', v)} placeholder="Schedule a Call" />
            <FieldRow label="CTA URL" id="m-ctaUrl" value={fields.ctaUrl} onChange={(v) => setField('ctaUrl', v)} placeholder="https://calendly.com/..." />
          </div>

          <div className="border-t border-[#f9fafb] pt-4 mt-1">
            <p className="field-section-label">Assets</p>
            <FieldRow label="Photo URL" id="m-photoUrl" value={fields.photoUrl} onChange={(v) => setField('photoUrl', v)} placeholder="https://... (90×90 px)" />
            <FieldRow label="Logo URL" id="m-logoUrl" value={fields.logoUrl} onChange={(v) => setField('logoUrl', v)} placeholder="https://... (120×30 px PNG)" />
          </div>

          <div className="border-t border-[#f9fafb] pt-4 mt-1">
            <p className="field-section-label">Style</p>
            <label htmlFor="m-accentColor" className="field-label block mb-2">Accent / Highlight Color</label>
            <div className="flex items-center gap-3">
              <input
                id="m-accentColor" type="color" value={fields.accentColor}
                onChange={(e) => setField('accentColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#e5e7eb] bg-white cursor-pointer p-0.5"
              />
              <span className="text-[#888888] text-[13px] font-mono">{fields.accentColor}</span>
            </div>
          </div>
        </AccordionSection>

        {/* Section 2: Confidentiality Clause */}
        <AccordionSection
          icon={<Lock size={16} />}
          title="Confidentiality Clause"
          badge={fields.confidentialityEnabled ? 'ON' : undefined}
        >
          <div className="mb-4">
            <Toggle
              checked={fields.confidentialityEnabled}
              onChange={(v) => setField('confidentialityEnabled', v)}
              label="Append confidentiality notice"
            />
          </div>
          {fields.confidentialityEnabled && (
            <div>
              <label htmlFor="m-clause" className="field-label block mb-1.5">Clause Text</label>
              <textarea
                id="m-clause"
                value={fields.confidentialityText}
                onChange={(e) => setField('confidentialityText', e.target.value)}
                placeholder="Paste your confidentiality or privacy notice here..."
                rows={6}
                className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3 py-2.5 text-[13px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/15 transition-colors resize-y leading-relaxed"
              />
              <p className="text-[11px] text-[#aaaaaa] font-mono mt-1">Renders as small italic text below the signature.</p>
            </div>
          )}
          {!fields.confidentialityEnabled && (
            <p className="text-[13px] text-[#aaaaaa] leading-relaxed">Enable to append a legal confidentiality or privacy notice below every signature.</p>
          )}
        </AccordionSection>

        {/* Section 3: Tracking Parameters */}
        <AccordionSection
          icon={<Link2 size={16} />}
          title="Tracking Parameters"
          badge={fields.trackingEnabled && activeUtm > 0 ? `${activeUtm} param${activeUtm > 1 ? 's' : ''}` : undefined}
        >
          <div className="mb-4">
            <Toggle
              checked={fields.trackingEnabled}
              onChange={(v) => setField('trackingEnabled', v)}
              label="Append UTM parameters to all links"
            />
          </div>
          {fields.trackingEnabled && (
            <div>
              <p className="text-[12px] text-[#888888] mb-4 leading-relaxed">Appended to website URL, CTA link, and other URLs in the signature.</p>
              <FieldRow label="utm_source" id="m-utmSource" value={fields.utmSource} onChange={(v) => setField('utmSource', v)} placeholder="email" />
              <FieldRow label="utm_medium" id="m-utmMedium" value={fields.utmMedium} onChange={(v) => setField('utmMedium', v)} placeholder="signature" />
              <FieldRow label="utm_campaign" id="m-utmCampaign" value={fields.utmCampaign} onChange={(v) => setField('utmCampaign', v)} placeholder="q1-outreach" />
              <FieldRow label="utm_content" id="m-utmContent" value={fields.utmContent} onChange={(v) => setField('utmContent', v)} placeholder="cta-button" />
              {(fields.utmSource || fields.utmMedium || fields.utmCampaign || fields.utmContent) && (
                <div className="mt-1 bg-[#f9f9f9] border border-[#e5e7eb] rounded-lg px-3 py-2.5">
                  <p className="field-label mb-1">Preview</p>
                  <p className="text-[11px] font-mono text-[#555555] break-all leading-relaxed">
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
            <p className="text-[13px] text-[#aaaaaa] leading-relaxed">Enable to automatically append UTM tracking parameters to all links.</p>
          )}
        </AccordionSection>

        {/* New employee button */}
        <div className="px-4 py-4">
          <button
            onClick={newEmployee}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-[13px] font-medium text-[#aaaaaa] border border-dashed border-[#e5e7eb] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            <Plus size={14} />
            Start Over
          </button>
        </div>

      </div>

      {/* Fixed footer — always visible at bottom of the editor pane */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '12px 16px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
          zIndex: 10,
        }}
        className="space-y-3">
        <button
          onClick={saveEmployee}
          className="btn-orange w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-[15px] font-semibold"
        >
          <Save size={16} />
          Save
          {isDirty && <span className="ml-auto w-2 h-2 rounded-full bg-white opacity-70" />}
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            <Download size={14} />
            Download HTML
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            Copy HTML
          </button>
        </div>
      </div>
    </div>
  );
}
