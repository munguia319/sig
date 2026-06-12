'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Layout, LayoutGrid, ListFilter, Search } from 'lucide-react';
import Link from 'next/link';

type Template = {
  id: string;
  name: string;
  description: string;
  preview_html: string;
  tags: string[];
};

export function TemplateGallery({ accountSlug }: { accountSlug: string }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    let active = true;
    fetch('/api/templates')
      .then((r) => {
        if (!r.ok) throw new Error('bad response');
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        setTemplates(data.templates ?? []);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Failed to load templates', error);
        setTemplates([]);
      })
      .finally(() => setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#f9fafb]" />;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Search & Filter Bar */}
      <div className="bg-white border-b border-[#e5e7eb] px-8 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaaaaa]" size={16} />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full bg-[#f4f4f4] border-transparent focus:bg-white focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 rounded-lg pl-10 pr-4 py-2 text-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-[#555555] hover:text-[#111111] px-3 py-2 rounded-md hover:bg-[#f4f4f4] transition-all">
              <ListFilter size={16} />
              Filter
            </button>
            <div className="w-px h-6 bg-[#e5e7eb]" />
            <div className="flex bg-[#f4f4f4] rounded-lg p-1">
              <button className="p-1.5 bg-white shadow-sm rounded-md text-[#111111]">
                <LayoutGrid size={16} />
              </button>
              <button className="p-1.5 text-[#aaaaaa] hover:text-[#555555]">
                <Layout size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#111111] tracking-tight mb-2">Email Signature Templates</h1>
          <p className="text-[#888888] text-sm">Select a professional, table-based template to start building signatures for your team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 text-center text-sm text-[#666]">Loading templates…</div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="group flex flex-col bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden hover:border-[#111111] hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
              >
                {/* Preview Section */}
                <div className="aspect-[4/3] bg-[#f4f4f4] relative overflow-hidden flex items-center justify-center p-6 border-b border-[#e5e7eb]">
                  <div className="w-full h-full bg-white rounded-lg shadow-sm border border-[#e5e7eb] overflow-hidden">
                    <iframe
                      srcDoc={(template as any).preview_html ?? ''}
                      className="w-full h-full border-0 pointer-events-none scale-[0.6] origin-top"
                      title={template.name}
                    />
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <Link
                      // href={`/home/${accountSlug}/signature/editor?template=${template.id}`}
                      href={`/signature/editor?template=${template.id}`}
                      className="bg-white text-[#111111] px-6 py-2.5 rounded-full font-semibold text-sm shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                      Customize Layout <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-[#111111] text-lg">{template.name}</h3>
                    <div className="flex gap-1">
                      {(template.tags ?? []).slice(0, 1).map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-[#f4f4f4] text-[#888888] px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-[#555555] line-clamp-2 leading-relaxed mb-6">
                    {template.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-[#f4f4f4] flex items-center justify-between">
                    <span className="text-[12px] font-medium text-[#aaaaaa]">Table-based HTML</span>
                    <Link
                      // href={`/home/${accountSlug}/signature/editor?template=${template.id}`}
                      href={`/signature/editor?template=${template.id}`}
                      className="text-sm font-bold text-[#111111] hover:underline flex items-center gap-1"
                    >
                      Select <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
