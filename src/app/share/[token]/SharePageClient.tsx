'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function SharePageClient({
    html,
}: {
    html: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(html);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            console.error('Failed to copy');
        }
    };

    return (
        <button className="copy-btn" onClick={handleCopy}>
            {copied ? (
                <>
                    <Check size={16} />
                    Copied
                </>
            ) : (
                <>
                    <Copy size={16} />
                    Copy HTML
                </>
            )}
        </button>
    );
}