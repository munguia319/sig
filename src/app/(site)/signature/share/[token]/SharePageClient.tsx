'use client';

import React from 'react';

export function SharePageClient({ html }: { html: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(html).then(() => {
      alert('HTML copied to clipboard!');
    }).catch(() => {
      alert('Could not copy HTML');
    });
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      Copy HTML
    </button>
  );
}
