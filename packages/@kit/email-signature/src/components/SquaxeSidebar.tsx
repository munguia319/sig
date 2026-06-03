/**
 * SquaxeSidebar
 * ==============
 * Sidebar for "The Squaxe" template.
 * Fields: Name, Title, Email, Phone, Website, Address,
 *         Photo URL, Logo URL, Banner URL,
 *         Social links (LinkedIn, X, Facebook, Instagram, YouTube),
 *         Confidentiality, Tracking.
 */

import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { generateSquaxeHtml } from '@kit/email-signature/lib/generateSquaxeHtml';
import {
  ChevronDown, ChevronRight, Download, FileSignature,
  Link2, Lock, Plus, Save, Share2, User,
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

function toSquaxeFields(f: ReturnType<typeof useSignature>['fields']) {
  return {
    fullName: f.fullName,
    jobTitle: f.jobTitle,
    email: f.email,
    phone: f.phone,
    website: f.website,
    streetAddress: f.streetAddress,
    photoUrl: f.photoUrl,
    logoUrl: f.logoUrl,
    bannerUrl: f.bannerUrl,
    linkedinUrl: f.linkedinUrl,
    twitterUrl: f.twitterUrl,
    facebookUrl: f.facebookUrl,
    instagramUrl: f.instagramUrl,
    youtubeUrl: f.youtubeUrl,
    confidentialityEnabled: f.confidentialityEnabled,
    confidentialityText: f.confidentialityText,
    trackingEnabled: f.trackingEnabled,
    utmSource: f.utmSource,
    utmMedium: f.utmMedium,
    utmCampaign: f.utmCampaign,
    utmContent: f.utmContent,
  };
}

export function SquaxeSidebar() {
  const { fields, setField, saveEmployee, isDirty, newEmployee, activeEmployeeId } = useSignature();
  const activeUtm = [fields.utmSource, fields.utmMedium, fields.utmCampaign, fields.utmContent].filter(Boolean).length;

  function handleDownload() {
    const html = generateSquaxeHtml(toSquaxeFields(fields));
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
    navigator.clipboard.writeText(generateSquaxeHtml(toSquaxeFields(fields)))
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
          {activeEmployeeId ? `Editing: ${fields.fullName || 'Untitled'}` : 'New signature'} · The Squaxe
        </p>
      </div>

      <div className="sidebar-scroll">

        {/* Section 1: General Info */}
        <AccordionSection icon={<User size={14} />} title="General Info & Assets" defaultOpen={true}>
          <p className="field-section-label">Identity</p>
          <FieldRow label="Full Name" id="q-fullName" value={fields.fullName} onChange={(v) => setField('fullName', v)} placeholder="Julie Harbaugh" />
          <FieldRow label="Job Title" id="q-jobTitle" value={fields.jobTitle} onChange={(v) => setField('jobTitle', v)} placeholder="Chief Signature Officer" />

          <div className="sidebar-section">
            <p className="field-section-label">Contact</p>
            <FieldRow label="Email Address" id="q-email" value={fields.email} onChange={(v) => setField('email', v)} placeholder="email@company.com" type="email" />
            <FieldRow label="Phone" id="q-phone" value={fields.phone} onChange={(v) => setField('phone', v)} placeholder="123-456-7890" type="tel" />
            <FieldRow label="Website" id="q-website" value={fields.website} onChange={(v) => setField('website', v)} placeholder="www.website.com" />
            <FieldRow label="Street Address" id="q-streetAddress" value={fields.streetAddress} onChange={(v) => setField('streetAddress', v)} placeholder="1234 Street, City, ST 00000" />
          </div>

          <div className="sidebar-section">
            <p className="field-section-label">Assets</p>
            <FieldRow label="Photo URL" id="q-photoUrl" value={fields.photoUrl} onChange={(v) => setField('photoUrl', v)} placeholder="https://... (90×90 px square)" />
            <FieldRow label="Logo URL" id="q-logoUrl" value={fields.logoUrl} onChange={(v) => setField('logoUrl', v)} placeholder="https://... (120×40 px PNG)" />
            <FieldRow label="Banner Image URL" id="q-bannerUrl" value={fields.bannerUrl} onChange={(v) => setField('bannerUrl', v)} placeholder="https://... (560×120 px)" />
          </div>
        </AccordionSection>

        {/* Section 2: Social Links */}
        <AccordionSection icon={<Share2 size={14} />} title="Social Links" defaultOpen={true}>
          <p className="text-[11px] text-[#888888] mb-3 leading-relaxed">Leave blank to hide that icon from the signature.</p>
          <FieldRow label="LinkedIn URL" id="q-linkedin" value={fields.linkedinUrl} onChange={(v) => setField('linkedinUrl', v)} placeholder="https://linkedin.com/in/..." />
          <FieldRow label="X / Twitter URL" id="q-twitter" value={fields.twitterUrl} onChange={(v) => setField('twitterUrl', v)} placeholder="https://x.com/..." />
          <FieldRow label="Facebook URL" id="q-facebook" value={fields.facebookUrl} onChange={(v) => setField('facebookUrl', v)} placeholder="https://facebook.com/..." />
          <FieldRow label="Instagram URL" id="q-instagram" value={fields.instagramUrl} onChange={(v) => setField('instagramUrl', v)} placeholder="https://instagram.com/..." />
          <FieldRow label="YouTube URL" id="q-youtube" value={fields.youtubeUrl} onChange={(v) => setField('youtubeUrl', v)} placeholder="https://youtube.com/..." />
        </AccordionSection>

        {/* Section 3: Confidentiality */}
        <AccordionSection icon={<Lock size={14} />} title="Confidentiality Clause" badge={fields.confidentialityEnabled ? 'ON' : undefined}>
          <div className="mb-3">
            <Toggle checked={fields.confidentialityEnabled} onChange={(v) => setField('confidentialityEnabled', v)} label="Append confidentiality notice" />
          </div>
          {fields.confidentialityEnabled && (
            <div className="mt-3">
              <label htmlFor="q-clause" className="field-label block mb-1">Clause Text</label>
              <textarea id="q-clause" value={fields.confidentialityText} onChange={(e) => setField('confidentialityText', e.target.value)} rows={6}
                className="w-full bg-white border border-[#e5e7eb] rounded px-2.5 py-1.5 text-[12px] text-[#1a1a1a] placeholder-[#bbbbbb] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 transition-colors resize-y leading-relaxed" />
              <p className="text-[10px] text-[#aaaaaa] font-mono mt-1">Renders below the banner image.</p>
            </div>
          )}
          {!fields.confidentialityEnabled && <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">Enable to append a legal confidentiality or privacy notice below the banner.</p>}
        </AccordionSection>

        {/* Section 4: Tracking */}
        <AccordionSection icon={<Link2 size={14} />} title="Tracking Parameters" badge={fields.trackingEnabled && activeUtm > 0 ? `${activeUtm} param${activeUtm > 1 ? 's' : ''}` : undefined}>
          <div className="mb-3">
            <Toggle checked={fields.trackingEnabled} onChange={(v) => setField('trackingEnabled', v)} label="Append UTM parameters to all links" />
          </div>
          {fields.trackingEnabled && (
            <div className="mt-3">
              <FieldRow label="utm_source" id="q-utmSource" value={fields.utmSource} onChange={(v) => setField('utmSource', v)} placeholder="email" />
              <FieldRow label="utm_medium" id="q-utmMedium" value={fields.utmMedium} onChange={(v) => setField('utmMedium', v)} placeholder="signature" />
              <FieldRow label="utm_campaign" id="q-utmCampaign" value={fields.utmCampaign} onChange={(v) => setField('utmCampaign', v)} placeholder="q1-outreach" />
              <FieldRow label="utm_content" id="q-utmContent" value={fields.utmContent} onChange={(v) => setField('utmContent', v)} placeholder="cta-button" />
            </div>
          )}
          {!fields.trackingEnabled && <p className="text-[12px] text-[#aaaaaa] mt-1 leading-relaxed">Enable to automatically append UTM tracking parameters to all social and website links.</p>}
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
