'use client';

/**
 * SignatureContext
 * ================
 * Global state for the Email Signature Builder.
 *
 * Single flat SignatureFields interface covering all templates.
 * The `activeTemplate` field determines which HTML generator and
 * which sidebar sections are rendered.
 *
 * Template IDs:
 *   'the-opensend' — two-column with photo, icons, CTA
 *   'the-foley'    — single-column with address, links row, logo
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from '@kit/ui/sonner';
import { createSupabaseBrowserClient } from '@kit/supabase/browser-client';

export interface SignatureFields {
  activeTemplate: string;

  // ── Shared / The Opensend ──────────────────────────────────────────────────
  fullName: string;
  jobTitle: string;
  companyName: string;
  phone: string;
  email: string;
  logoUrl: string;

  // Confidentiality (all templates)
  confidentialityEnabled: boolean;
  confidentialityText: string;

  // Tracking (all templates)
  trackingEnabled: boolean;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;

  // ── The Opensend specific ──────────────────────────────────────────────────
  website: string;
  ctaText: string;
  ctaUrl: string;
  photoUrl: string;
  accentColor: string;

  // ── The Foley specific ─────────────────────────────────────────────────────
  companyUrl: string;
  streetAddress: string;
  bioUrl: string;
  linkedinUrl: string;
  brandColor: string;

  // ── The Storysnap specific ────────────────────────────────────────────────
  brandsLine: string;

  // ── The Squaxe specific ──────────────────────────────────────────────────
  twitterUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  bannerUrl: string;

  // ── The Dozer specific ──────────────────────────────────────────────────
  cellPhone: string;
  officePhone: string;
  promoText: string;
  promoLinkText: string;
  promoLinkUrl: string;

  // ── The Johnson specific ────────────────────────────────────────────────
  department: string;
}

export interface SavedEmployee {
  id: string;
  employeeName: string;
  templateId: string;
  fields: SignatureFields;
  updatedAt: string;
}

const SHARED_DEFAULTS = {
  confidentialityEnabled: false,
  confidentialityText: 'CONFIDENTIALITY NOTICE: This email and any attachments are for the exclusive and confidential use of the intended recipient. If you are not the intended recipient, please do not read, distribute, or take action in reliance upon this message.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
};

export const DEFAULT_OPENSEND_FIELDS: SignatureFields = {
  ...SHARED_DEFAULTS,
  activeTemplate: 'the-opensend',
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  companyName: 'Company',
  phone: '123-456-7890',
  email: 'name@company.com',
  logoUrl: '',
  website: 'https://company.com',
  ctaText: 'Schedule a Call',
  ctaUrl: 'https://company.com',
  photoUrl: '',
  accentColor: '#c8b84a',
  // Foley fields (unused but required by interface)
  companyUrl: '',
  streetAddress: '',
  bioUrl: '',
  linkedinUrl: '',
  brandColor: '#1a6abf',
  // Storysnap fields (unused but required by interface)
  brandsLine: '',
  // Squaxe fields (unused but required by interface)
  twitterUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  bannerUrl: '',
  // Dozer fields (unused)
  cellPhone: '',
  officePhone: '',
  promoText: '',
  promoLinkText: '',
  promoLinkUrl: '',
  // Johnson fields (unused)
  department: '',
};

export const DEFAULT_FOLEY_FIELDS: SignatureFields = {
  ...SHARED_DEFAULTS,
  activeTemplate: 'the-foley',
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  companyName: 'Company Name',
  phone: '123-456-7890',
  email: 'name@company.com',
  logoUrl: '',
  companyUrl: 'https://company.com',
  streetAddress: '1234 Street Address, City, ST 00000',
  bioUrl: 'https://company.com/bio',
  linkedinUrl: 'https://linkedin.com',
  brandColor: '#1a6abf',
  // Opensend fields (unused but required by interface)
  website: '',
  ctaText: '',
  ctaUrl: '',
  photoUrl: '',
  accentColor: '#c8b84a',
  // Storysnap fields (unused but required by interface)
  brandsLine: '',
  // Squaxe fields (unused but required by interface)
  twitterUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  bannerUrl: '',
  // Dozer fields (unused)
  cellPhone: '',
  officePhone: '',
  promoText: '',
  promoLinkText: '',
  promoLinkUrl: '',
  // Johnson fields (unused)
  department: '',
};

export const DEFAULT_STORYSNAP_FIELDS: SignatureFields = {
  ...SHARED_DEFAULTS,
  activeTemplate: 'the-storysnap',
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  companyName: 'Company',
  phone: '',
  email: 'name@company.com',
  logoUrl: '',
  website: 'www.company.com',
  ctaText: 'See why proof beats persuasion',
  ctaUrl: 'https://company.com',
  photoUrl: '',
  accentColor: '#e8417a',
  brandColor: '#e8417a',
  brandsLine: 'Brands: Brand One & Brand Two',
  // Foley fields (unused)
  companyUrl: '',
  streetAddress: '',
  bioUrl: '',
  linkedinUrl: '',
  // Squaxe fields (unused)
  twitterUrl: '',
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  bannerUrl: '',
  // Dozer fields (unused)
  cellPhone: '',
  officePhone: '',
  promoText: '',
  promoLinkText: '',
  promoLinkUrl: '',
  // Johnson fields (unused)
  department: '',
};

export const DEFAULT_SQUAXE_FIELDS: SignatureFields = {
  ...SHARED_DEFAULTS,
  activeTemplate: 'the-squaxe',
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  companyName: '',
  phone: '123-456-7890',
  email: 'name@company.com',
  logoUrl: '',
  website: 'www.company.com',
  streetAddress: '1234 Street Address, City, ST 00000',
  photoUrl: '',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://x.com',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  bannerUrl: '',
  // Unused fields
  ctaText: '',
  ctaUrl: '',
  accentColor: '#888888',
  brandColor: '#888888',
  brandsLine: '',
  companyUrl: '',
  bioUrl: '',
  confidentialityEnabled: true,
  confidentialityText: 'The content of this message is confidential and intended only for the designated recipient(s). If you received it by mistake, please let us know and then delete it. Please do not copy, forward, or in any way reveal the content of this message.',
  trackingEnabled: false,
  utmSource: 'email',
  utmMedium: 'signature',
  utmCampaign: '',
  utmContent: '',
  // Dozer fields (unused)
  cellPhone: '',
  officePhone: '',
  promoText: '',
  promoLinkText: '',
  promoLinkUrl: '',
  // Johnson fields (unused)
  department: '',
};

export const DEFAULT_DOZER_FIELDS: SignatureFields = {
  ...SHARED_DEFAULTS,
  activeTemplate: 'the-dozer',
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  companyName: '',
  phone: '',
  email: 'name@company.com',
  logoUrl: '',
  website: 'www.company.com',
  cellPhone: '123-456-7890',
  officePhone: '123-456-7890 ext 000',
  promoText: 'Custom text or promo copy here with a',
  promoLinkText: 'link',
  promoLinkUrl: 'https://company.com',
  brandColor: '#cc44cc',
  linkedinUrl: 'https://linkedin.com',
  instagramUrl: 'https://instagram.com',
  twitterUrl: 'https://x.com',
  facebookUrl: 'https://facebook.com',
  confidentialityEnabled: true,
  confidentialityText: 'Add the confidentiality copy here. Add the confidentiality copy here. Add the confidentiality copy here. Add the confidentiality copy here. Add the confidentiality copy here.',
  // Unused fields
  photoUrl: '',
  accentColor: '#cc44cc',
  ctaText: '',
  ctaUrl: '',
  companyUrl: '',
  streetAddress: '',
  bioUrl: '',
  youtubeUrl: '',
  bannerUrl: '',
  brandsLine: '',
  // Johnson fields (unused)
  department: '',
};

export const DEFAULT_JOHNSON_FIELDS: SignatureFields = {
  ...DEFAULT_OPENSEND_FIELDS,
  activeTemplate: 'the-johnson',
  fullName: 'First Last',
  jobTitle: 'Web Designer',
  department: 'Creative',
  companyName: 'Company',
  email: 'name@company.com',
  phone: '123-456-7890',
  website: 'company.com',
  streetAddress: '1234 Street Address, City, ST 00000',
  photoUrl: '',
  logoUrl: '',
  brandColor: '#EC654E',
  linkedinUrl: 'https://linkedin.com',
  instagramUrl: 'https://instagram.com',
  confidentialityEnabled: false,
};

export function getDefaultFieldsForTemplate(templateId: string): SignatureFields {
  if (templateId === 'the-foley') return { ...DEFAULT_FOLEY_FIELDS };
  if (templateId === 'the-storysnap') return { ...DEFAULT_STORYSNAP_FIELDS };
  if (templateId === 'the-squaxe') return { ...DEFAULT_SQUAXE_FIELDS };
  if (templateId === 'the-dozer') return { ...DEFAULT_DOZER_FIELDS };
  if (templateId === 'the-johnson') return { ...DEFAULT_JOHNSON_FIELDS };
  return { ...DEFAULT_OPENSEND_FIELDS };
}

interface SignatureContextValue {
  fields: SignatureFields;
  setField: <K extends keyof SignatureFields>(key: K, value: SignatureFields[K]) => void;
  setFields: (fields: SignatureFields) => void;
  employees: SavedEmployee[];
  activeEmployeeId: string | null;
  setActiveEmployeeId: (id: string | null) => void;
  saveEmployee: () => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  loadEmployee: (employee: SavedEmployee) => void;
  newEmployee: () => void;
  isDirty: boolean;
  accountId?: string;
}

const SignatureContext = createContext<SignatureContextValue | null>(null);

export function SignatureProvider({
  children,
  initialTemplate = 'the-opensend',
  accountId,
}: {
  children: React.ReactNode;
  initialTemplate?: string;
  accountId?: string;
}) {
  const defaultFields = useMemo(() => getDefaultFieldsForTemplate(initialTemplate), [initialTemplate]);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [fields, setFieldsState] = useState<SignatureFields>(defaultFields);
  const [employees, setEmployees] = useState<SavedEmployee[]>([]);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setEmployees([]);
    setActiveEmployeeId(null);
    setFieldsState(defaultFields);
  }, [accountId, defaultFields]);

  useEffect(() => {
    if (!accountId) return;
    let isMounted = true;

    const loadEmployees = async () => {
      const { data, error } = await supabase
        .from('email_signatures')
        .select('*')
        .eq('account_id', accountId)
        .order('updated_at', { ascending: false });

      if (!isMounted) return;
      if (error) {
        toast.error('Unable to load signatures');
        return;
      }

      setEmployees(
        (data ?? []).map((row) => ({
          id: row.id,
          employeeName: row.employee_name,
          templateId: row.template_id,
          fields: row.fields as SignatureFields,
          updatedAt: typeof row.updated_at === 'string'
            ? row.updated_at
            : row.updated_at?.toISOString() ?? new Date().toISOString(),
        }))
      );
    };

    loadEmployees();
    return () => {
      isMounted = false;
    };
  }, [accountId, supabase]);

  const setField = useCallback(<K extends keyof SignatureFields>(key: K, value: SignatureFields[K]) => {
    setFieldsState((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  }, []);

  const setFields = useCallback((newFields: SignatureFields) => {
    setFieldsState(newFields);
    setIsDirty(false);
  }, []);

  const saveEmployee = useCallback(async () => {
    if (!accountId) {
      toast.error('Missing account ID');
      return;
    }

    const name = fields.fullName.trim() || 'Unnamed Employee';
    const payload = {
      id: activeEmployeeId ?? undefined,
      account_id: accountId,
      employee_name: name,
      template_id: fields.activeTemplate,
      fields,
      updated_at: new Date().toISOString(),
    };

    let response;
    try {
      if (activeEmployeeId) {
        // Use update for clarity when editing an existing employee
        response = await supabase
          .from('email_signatures')
          .update({
            employee_name: payload.employee_name,
            template_id: payload.template_id,
            fields: payload.fields,
            updated_at: payload.updated_at,
          })
          .eq('id', activeEmployeeId)
          .eq('account_id', accountId)
          .select('*')
          .single();
      } else {
        const { data: existing, error: findError } = await supabase
          .from('email_signatures')
          .select('id')
          .eq('account_id', accountId)
          .eq('template_id', payload.template_id)
          .order('updated_at', { ascending: false })
          .maybeSingle();

        if (findError) {
          toast.error('Could not check existing signature');
          // eslint-disable-next-line no-console
          console.error('saveEmployee find error', findError);
          return;
        }

        if (existing && existing.id) {
          response = await supabase
            .from('email_signatures')
            .update({
              employee_name: payload.employee_name,
              fields: payload.fields,
              updated_at: payload.updated_at,
            })
            .eq('id', existing.id)
            .eq('account_id', accountId)
            .select('*')
            .single();
        } else {
          response = await supabase
            .from('email_signatures')
            .insert({
              account_id: payload.account_id,
              employee_name: payload.employee_name,
              template_id: payload.template_id,
              fields: payload.fields,
              updated_at: payload.updated_at,
            })
            .select('*')
            .single();
        }
      }
    } catch (err) {
      toast.error('Could not save signature');
      // eslint-disable-next-line no-console
      console.error('saveEmployee exception', err);
      return;
    }

    if (response?.error || !response?.data) {
      const msg = response?.error?.message ?? 'Could not save signature';
      toast.error(msg);
      // eslint-disable-next-line no-console
      console.error('saveEmployee error', response?.error);
      return;
    }

    const saved = response.data;
    const updatedEmployee: SavedEmployee = {
      id: saved.id,
      employeeName: saved.employee_name,
      templateId: saved.template_id,
      fields: saved.fields as SignatureFields,
      updatedAt: typeof saved.updated_at === 'string'
        ? saved.updated_at
        : saved.updated_at?.toISOString() ?? new Date().toISOString(),
    };

    setEmployees((prev) => {
      const exists = prev.some((emp) => emp.id === updatedEmployee.id);
      return exists
        ? prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        : [updatedEmployee, ...prev];
    });

    setActiveEmployeeId(updatedEmployee.id);
    setFieldsState(updatedEmployee.fields);
    setIsDirty(false);
    toast.success(`${activeEmployeeId ? 'Saved' : 'Created'} signature for ${name}`);
  }, [accountId, activeEmployeeId, fields, supabase]);

  const deleteEmployee = useCallback(async (id: string) => {
    if (!accountId) {
      toast.error('Missing account ID');
      return;
    }

    const { error } = await supabase
      .from('email_signatures')
      .delete()
      .eq('id', id)
      .eq('account_id', accountId);

    if (error) {
      toast.error('Could not delete signature');
      return;
    }

    setEmployees((prev) => prev.filter((e) => e.id !== id));

    if (activeEmployeeId === id) {
      setActiveEmployeeId(null);
      setFieldsState(getDefaultFieldsForTemplate(fields.activeTemplate));
    }

    toast.success('Signature deleted');
  }, [accountId, activeEmployeeId, fields.activeTemplate, supabase]);

  const loadEmployee = useCallback((employee: SavedEmployee) => {
    setFieldsState({ ...employee.fields });
    setActiveEmployeeId(employee.id);
    setIsDirty(false);
  }, []);

  useEffect(() => {
    if (activeEmployeeId) return;
    const existingByTemplate = employees.find((employee) => employee.templateId === defaultFields.activeTemplate);
    if (!existingByTemplate) return;

    setFieldsState(existingByTemplate.fields);
    setActiveEmployeeId(existingByTemplate.id);
    setIsDirty(false);
  }, [activeEmployeeId, defaultFields.activeTemplate, employees]);

  const newEmployee = useCallback(() => {
    const blank = getDefaultFieldsForTemplate(fields.activeTemplate);
    setFieldsState({ ...blank, fullName: '', jobTitle: '', email: '', phone: '' });
    setActiveEmployeeId(null);
    setIsDirty(false);
  }, [fields.activeTemplate]);

  return (
    <SignatureContext.Provider value={{
      fields, setField, setFields,
      employees, activeEmployeeId, setActiveEmployeeId,
      saveEmployee, deleteEmployee, loadEmployee, newEmployee,
      isDirty,
      accountId,
    }}>
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignature() {
  const ctx = useContext(SignatureContext);
  if (!ctx) throw new Error('useSignature must be used within SignatureProvider');
  return ctx;
}
