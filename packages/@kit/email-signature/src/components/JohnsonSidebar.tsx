/**
 * JohnsonSidebar
 * ===============
 * Sidebar for "The Johnson" template.
 */

import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { generateJohnsonHtml } from '@kit/email-signature/lib/generateJohnsonHtml';
import { ChevronDown, ChevronRight, Download, FileSignature, Link2, Lock, Plus, Save, Share2, User } from 'lucide-react';
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

function toJohnsonFields(f: ReturnType<typeof useSignature>['fields']) {
  return {
    fullName: f.fullName, jobTitle: f.jobTitle, department: f.department,
    companyName: f.companyName, email: f.email, phone: f.phone,
    website: f.website, streetAddress: f.streetAddress,
    photoUrl: f.photoUrl, logoUrl: f.logoUrl, brandColor: f.brandColor,
    linkedinUrl: f.linkedinUrl, instagramUrl: f.instagramUrl,
    twitterUrl: f.twitterUrl, youtubeUrl: f.youtubeUrl, facebookUrl: f.facebookUrl,
    confidentialityEnabled: f.confidentialityEnabled, confidentialityText: f.confidentialityText,
    trackingEnabled: f.trackingEnabled, utmSource: f.utmSource,
    utmMedium: f.utmMedium, utmCampaign: f.utmCampaign, utmContent: f.utmContent,
  };
}

export function JohnsonSidebar() {
  const { fields, setField, saveEmployee, isDirty, newEmployee, activeEmployeeId } = useSignature();
  const activeUtm = [fields.utmSource, fields.utmMedium, fields.utmCampaign, fields.utmContent].filter(Boolean).length;

  function handleDownload() {
    const html = generateJohnsonHtml(toJohnsonFields(fields));
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
    navigator.clipboard.writeText(generateJohnsonHtml(toJohnsonFields(fields)))
      .then(() => toast.success('Raw HTML copied to clipboard'))
      .catch(() => toast.error('Could not copy to clipboard'));
  }

  return (
    <aside className="sidebar-shell">
      <div className="sidebar-header">
        <div className="flex items-center gap-2 mb-1">
          <FileSignature size={16} className="icon-muted" />
          <span className="text-[#1a1a1a] font-semibold text-sm tracking-tight">Signature Editor</span>
        </div>
        <p className="text-[#888888] text-[11px] font-mono">
          {activeEmployeeId ? `Editing: ${fields.fullName || 'Untitled'}` : 'New signature'} · The Johnson
        </p>
      </div>

      <div className="sidebar-scroll">
        <AccordionSection icon={<User size={14} />} title="General Info & Assets" defaultOpen={true}>
          <p className="field-section-label">Identity</p>
          <FieldRow label="Full Name" id="j-fullName" value={fields.fullName} onChange={(v) => setField('fullName', v)} placeholder="First Last" />
          <FieldRow label="Job Title" id="j-jobTitle" value={fields.jobTitle} onChange={(v) => setField('jobTitle', v)} placeholder="Web Designer" />
          <FieldRow label="Department" id="j-department" value={fields.department} onChange={(v) => setField('department', v)} placeholder="Creative" />
          <FieldRow label="Company Name" id="j-companyName" value={fields.companyName} onChange={(v) => setField('companyName', v)} placeholder="Company" />

          <div className="sidebar-section">
            <p className="field-section-label">Contact</p>
            <FieldRow label="Email Address" id="j-email" value={fields.email} onChange={(v) => setField('email', v)} placeholder="name@company.com" type="email" />
            <FieldRow label="Phone" id="j-phone" value={fields.phone} onChange={(v) => setField('phone', v)} placeholder="123-456-7890" type="tel" />
            <FieldRow label="Website" id="j-website" value={fields.website} onChange={(v) => setField('website', v)} placeholder="company.com" />
            <FieldRow label="Street Address" id="j-streetAddress" value={fields.streetAddress} onChange={(v) => setField('streetAddress', v)} placeholder="1234 Street, City, ST 00000" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Assets</p>
            <FieldRow label="Photo URL" id="j-photoUrl" value={fields.photoUrl} onChange={(v) => setField('photoUrl', v)} placeholder="https://... (80×80 px square)" />
            <FieldRow label="Logo URL" id="j-logoUrl" value={fields.logoUrl} onChange={(v) => setField('logoUrl', v)} placeholder="https://... (120×36 px PNG)" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Style</p>
            <label htmlFor="j-brandColor" className="field-label block mb-1">Brand Color</label>
            <p className="text-[11px] text-[#888888] mb-2 leading-relaxed">Controls job title, horizontal rule, email link, website link, and photo border.</p>
            <div className="flex items-center gap-2">
              <input id="j-brandColor" type="color" value={fields.brandColor} onChange={(e) => setField('brandColor', e.target.value)} className="w-8 h-8 rounded border border-[#e5e7eb] bg-white cursor-pointer p-0.5" />
              <span className="text-[#888888] text-[12px] font-mono">{fields.brandColor}</span>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection icon={<Share2 size={14} />} title="Social Links" defaultOpen={true}>
          <p className="text-[11px] text-[#888888] mb-3 leading-relaxed">Leave blank to hide that icon.</p>
          <FieldRow label="LinkedIn URL" id="j-linkedin" value={fields.linkedinUrl} onChange={(v) => setField('linkedinUrl', v)} placeholder="https://linkedin.com/in/..." />
          <FieldRow label="X / Twitter URL" id="j-twitter" value={fields.twitterUrl} onChange={(v) => setField('twitterUrl', v)} placeholder="https://x.com/..." />
          <FieldRow label="YouTube URL" id="j-youtube" value={fields.youtubeUrl} onChange={(v) => setField('youtubeUrl', v)} placeholder="https://youtube.com/..." />
          <FieldRow label="Facebook URL" id="j-facebook" value={fields.facebookUrl} onChange={(v) => setField('facebookUrl', v)} placeholder="https://facebook.com/..." />
          <FieldRow label="Instagram URL" id="j-instagram" value={fields.instagramUrl} onChange={(v) => setField('instagramUrl', v)} placeholder="https://instagram.com/..." />
        </AccordionSection>

        <AccordionSection icon={<Lock size={14} />} title="Confidentiality Clause" badge={fields.confidentialityEnabled ? 'ON' : undefined}>
          <div className="mb-3">
            <Toggle checked={fields.confidentialityEnabled} onChange={(v) => setField('confidentialityEnabled', v)} label="Append confidentiality notice" />
          </div>
          {fields.confidentialityEnabled && (
            <div className="mt-3">
              <label htmlFor="j-clause" className="field-label block mb-1">Clause Text</label>
              <textarea id="j-clause" value={fields.confidentialityText} onChange={(e) => setField('confidentialityText', e.target.value)} rows={6}
                className="w-full bg-white border border-[#e5e7eb] rounded px-2.5 py-1.5 text-[12px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 transition-colors resize-y leading-relaxed" />
            </div>
          )}
          {!fields.confidentialityEnabled && <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">Enable to append a legal confidentiality or privacy notice.</p>}
        </AccordionSection>

        <AccordionSection icon={<Link2 size={14} />} title="Tracking Parameters" badge={fields.trackingEnabled && activeUtm > 0 ? `${activeUtm} param${activeUtm > 1 ? 's' : ''}` : undefined}>
          <div className="mb-3">
            <Toggle checked={fields.trackingEnabled} onChange={(v) => setField('trackingEnabled', v)} label="Append UTM parameters to all links" />
          </div>
          {fields.trackingEnabled && (
            <div className="mt-3">
              <FieldRow label="utm_source" id="j-utmSource" value={fields.utmSource} onChange={(v) => setField('utmSource', v)} placeholder="email" />
              <FieldRow label="utm_medium" id="j-utmMedium" value={fields.utmMedium} onChange={(v) => setField('utmMedium', v)} placeholder="signature" />
              <FieldRow label="utm_campaign" id="j-utmCampaign" value={fields.utmCampaign} onChange={(v) => setField('utmCampaign', v)} placeholder="q1-outreach" />
              <FieldRow label="utm_content" id="j-utmContent" value={fields.utmContent} onChange={(v) => setField('utmContent', v)} placeholder="cta-button" />
            </div>
          )}
          {!fields.trackingEnabled && <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">Enable to automatically append UTM tracking parameters.</p>}
        </AccordionSection>
      </div>

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
