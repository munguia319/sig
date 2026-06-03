/**
 * StorysnapSidebar
 * =================
 * Sidebar for "The Storysnap" template.
 * Single brand color field controls HR, icon, and CTA link color.
 */

import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { generateStorysnapHtml } from '@kit/email-signature/lib/generateStorysnapHtml';
import {
  ChevronDown, ChevronRight, Download, FileSignature,
  Link2, Lock, Plus, Save, User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from '@kit/ui/sonner';

function FieldRow({ label, id, value, onChange, placeholder, type = 'text' }: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="field-label block mb-1">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-white border border-[#e5e7eb] rounded px-2.5 py-1.5 text-[13px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 transition-colors" />
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)} className={`toggle-track ${checked ? 'toggle-track-on' : 'toggle-track-off'}`}>
        <div className={`toggle-thumb ${checked ? 'toggle-thumb-on' : 'toggle-thumb-off'}`} />
      </div>
      <span className="text-[12px] text-[#555555]">{label}</span>
    </label>
  );
}

function AccordionSection({ icon, title, badge, defaultOpen = false, children }: {
  icon: React.ReactNode; title: string; badge?: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion-section">
      <button onClick={() => setOpen((v) => !v)} className="accordion-trigger">
        <span className="icon-muted">{icon}</span>
        <span className="flex-1 text-[13px] font-semibold text-[#1a1a1a]">{title}</span>
        {badge && <span className="section-badge">{badge}</span>}
        {open ? <ChevronDown size={14} className="text-[#aaaaaa] shrink-0" /> : <ChevronRight size={14} className="text-[#aaaaaa] shrink-0" />}
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </div>
  );
}

function toStorysnapFields(f: ReturnType<typeof useSignature>['fields']) {
  return {
    fullName: f.fullName,
    jobTitle: f.jobTitle,
    companyName: f.companyName,
    brandsLine: f.brandsLine,
    ctaText: f.ctaText,
    ctaUrl: f.ctaUrl,
    email: f.email,
    website: f.website,
    logoUrl: f.logoUrl,
    brandColor: f.brandColor,
    confidentialityEnabled: f.confidentialityEnabled,
    confidentialityText: f.confidentialityText,
    trackingEnabled: f.trackingEnabled,
    utmSource: f.utmSource,
    utmMedium: f.utmMedium,
    utmCampaign: f.utmCampaign,
    utmContent: f.utmContent,
  };
}

export function StorysnapSidebar() {
  const { fields, setField, saveEmployee, isDirty, newEmployee, activeEmployeeId } = useSignature();
  const activeUtm = [fields.utmSource, fields.utmMedium, fields.utmCampaign, fields.utmContent].filter(Boolean).length;

  function handleDownload() {
    const html = generateStorysnapHtml(toStorysnapFields(fields));
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
    navigator.clipboard.writeText(generateStorysnapHtml(toStorysnapFields(fields)))
      .then(() => toast.success('Raw HTML copied to clipboard'))
      .catch(() => toast.error('Could not copy to clipboard'));
  }

  return (
    <aside className="sidebar-shell">
      {/* Header */}
      <div className="sidebar-header">
        <div className="flex items-center gap-2 mb-1">
          <FileSignature size={16} className="icon-muted" />
          <span className="text-[#1a1a1a] font-semibold text-sm tracking-tight">Signature Editor</span>
        </div>
        <p className="text-[#888888] text-[11px] font-mono">
          {activeEmployeeId ? `Editing: ${fields.fullName || 'Untitled'}` : 'New signature'} · The Storysnap
        </p>
      </div>

      {/* Scrollable fields */}
      <div className="sidebar-scroll">

        {/* Section 1: General Info */}
        <AccordionSection icon={<User size={14} />} title="General Info & Assets" defaultOpen={true}>

          <p className="field-section-label">Identity</p>
          <FieldRow label="Full Name" id="s-fullName" value={fields.fullName} onChange={(v) => setField('fullName', v)} placeholder="Dan Gemmell" />
          <FieldRow label="Job Title" id="s-jobTitle" value={fields.jobTitle} onChange={(v) => setField('jobTitle', v)} placeholder="Sr. Account Executive" />
          <FieldRow label="Company Name" id="s-companyName" value={fields.companyName} onChange={(v) => setField('companyName', v)} placeholder="Storysnap" />
          <FieldRow label="Brands Line" id="s-brandsLine" value={fields.brandsLine} onChange={(v) => setField('brandsLine', v)} placeholder="Brands: X & Y" />

          <div className="sidebar-section">
            <p className="field-section-label">Call to Action</p>
            <FieldRow label="CTA Text" id="s-ctaText" value={fields.ctaText} onChange={(v) => setField('ctaText', v)} placeholder="See why proof beats persuasion" />
            <FieldRow label="CTA URL" id="s-ctaUrl" value={fields.ctaUrl} onChange={(v) => setField('ctaUrl', v)} placeholder="https://storysnap.com" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Contact</p>
            <FieldRow label="Email Address" id="s-email" value={fields.email} onChange={(v) => setField('email', v)} placeholder="name@company.com" type="email" />
            <FieldRow label="Website" id="s-website" value={fields.website} onChange={(v) => setField('website', v)} placeholder="www.company.com" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Assets</p>
            <FieldRow label="Logo URL" id="s-logoUrl" value={fields.logoUrl} onChange={(v) => setField('logoUrl', v)} placeholder="https://... (160×40 px PNG)" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Style</p>
            <label htmlFor="s-brandColor" className="field-label block mb-1">Brand Color</label>
            <p className="text-[11px] text-[#888888] mb-2 leading-relaxed">Controls the horizontal rule, envelope and globe icons, and CTA link color.</p>
            <div className="flex items-center gap-2">
              <input id="s-brandColor" type="color" value={fields.brandColor} onChange={(e) => setField('brandColor', e.target.value)} className="w-8 h-8 rounded border border-[#e5e7eb] bg-white cursor-pointer p-0.5" />
              <span className="text-[#888888] text-[12px] font-mono">{fields.brandColor}</span>
            </div>
          </div>
        </AccordionSection>

        {/* Section 2: Confidentiality */}
        <AccordionSection icon={<Lock size={14} />} title="Confidentiality Clause" badge={fields.confidentialityEnabled ? 'ON' : undefined}>
          <div className="mb-3">
            <Toggle checked={fields.confidentialityEnabled} onChange={(v) => setField('confidentialityEnabled', v)} label="Append confidentiality notice" />
          </div>
          {fields.confidentialityEnabled && (
            <div className="mt-3">
              <label htmlFor="s-clause" className="field-label block mb-1">Clause Text</label>
              <textarea id="s-clause" value={fields.confidentialityText} onChange={(e) => setField('confidentialityText', e.target.value)} rows={6}
                className="w-full bg-white border border-[#e5e7eb] rounded px-2.5 py-1.5 text-[12px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 transition-colors resize-y leading-relaxed" />
              <p className="text-[10px] text-[#aaaaaa] font-mono mt-1">Renders as small italic text below the website row.</p>
            </div>
          )}
          {!fields.confidentialityEnabled && <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">Enable to append a legal confidentiality or privacy notice.</p>}
        </AccordionSection>

        {/* Section 3: Tracking */}
        <AccordionSection icon={<Link2 size={14} />} title="Tracking Parameters" badge={fields.trackingEnabled && activeUtm > 0 ? `${activeUtm} param${activeUtm > 1 ? 's' : ''}` : undefined}>
          <div className="mb-3">
            <Toggle checked={fields.trackingEnabled} onChange={(v) => setField('trackingEnabled', v)} label="Append UTM parameters to all links" />
          </div>
          {fields.trackingEnabled && (
            <div className="mt-3">
              <p className="text-[11px] text-[#888888] mb-3 leading-relaxed">Appended to CTA and website links.</p>
              <FieldRow label="utm_source" id="s-utmSource" value={fields.utmSource} onChange={(v) => setField('utmSource', v)} placeholder="email" />
              <FieldRow label="utm_medium" id="s-utmMedium" value={fields.utmMedium} onChange={(v) => setField('utmMedium', v)} placeholder="signature" />
              <FieldRow label="utm_campaign" id="s-utmCampaign" value={fields.utmCampaign} onChange={(v) => setField('utmCampaign', v)} placeholder="q1-outreach" />
              <FieldRow label="utm_content" id="s-utmContent" value={fields.utmContent} onChange={(v) => setField('utmContent', v)} placeholder="cta-button" />
            </div>
          )}
          {!fields.trackingEnabled && <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">Enable to automatically append UTM tracking parameters.</p>}
        </AccordionSection>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={saveEmployee} className="btn-orange w-full flex items-center justify-center gap-2 rounded px-3 py-2 text-sm">
          <Save size={14} />Save
          {isDirty && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
        </button>
        <div className="flex gap-2">
          <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors">
            <Download size={13} />Download HTML
          </button>
          <button onClick={handleCopy} className="flex-1 flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium border border-[#e5e7eb] text-[#555555] hover:border-[#111111] hover:text-[#111111] transition-colors">
            Copy HTML
          </button>
        </div>
        <button onClick={newEmployee} className="w-full flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12px] font-medium text-[#aaaaaa] hover:text-[#111111] transition-colors">
          <Plus size={13} />Start Over
        </button>
      </div>
    </aside>
  );
}
