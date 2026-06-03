'use client';

import React from 'react';
import { useSignature } from '@kit/email-signature/contexts/SignatureContext';
import { SignaturePreview } from './SignaturePreview';
import { SignatureSidebar } from './SignatureSidebar';
import { FoleySidebar } from './FoleySidebar';
import { StorysnapSidebar } from './StorysnapSidebar';
import { SquaxeSidebar } from './SquaxeSidebar';
import { DozerSidebar } from './DozerSidebar';
import { JohnsonSidebar } from './JohnsonSidebar';
import { ShareButton } from './ShareButton';
import { EmployeeList } from './EmployeeList';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function SignatureEditor({
  templateId,
  accountSlug,
  csrfToken
}: {
  templateId: string;
  accountSlug: string;
  csrfToken?: string;
}) {
  const { fields, setField } = useSignature();



  // Sidebar selector
  const renderSidebar = () => {
    switch (fields.activeTemplate) {
      case 'the-foley': return <FoleySidebar />;
      case 'the-storysnap': return <StorysnapSidebar />;
      case 'the-squaxe': return <SquaxeSidebar />;
      case 'the-dozer': return <DozerSidebar />;
      case 'the-johnson': return <JohnsonSidebar />;
      default: return <SignatureSidebar />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Top Navigation */}
      <header className="h-14 border-b border-[#e5e7eb] flex items-center justify-between px-4 shrink-0 bg-white z-20">
        <div className="flex items-center gap-4">
          <Link
            // href={`/home/${accountSlug}/signature`}
            href={`/signature`}
            className="flex items-center gap-1.5 text-[13px] text-[#888888] hover:text-[#111111] transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Templates
          </Link>
          <div className="w-px h-4 bg-[#e5e7eb]" />
          <h1 className="text-sm font-semibold text-[#111111]">
            Standard Email Signature
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-[#f4f4f4] flex items-center justify-center text-[10px] font-bold text-[#aaaaaa]">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>

          <div className="w-px h-8 bg-[#e5e7eb] mx-1" />

          <ShareButton csrfToken={csrfToken} />

          <button className="text-[12px] font-medium text-white bg-[#111111] hover:bg-[#333333] px-4 py-1.5 rounded-md transition-colors">
            Publish
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Holder */}
        <div className="w-80 shrink-0 border-r border-[#e5e7eb] flex flex-col bg-[#ffffff] h-full">
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderSidebar()}
          </div>
          {/* <EmployeeList /> */}
        </div>

        {/* Preview Area Holder */}
        <main className="flex-1 overflow-hidden relative bg-[#f9fafb]">
          <SignaturePreview />
        </main>
      </div>
    </div>
  );
}
