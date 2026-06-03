import { notFound } from 'next/navigation';
import { createSupabaseServiceClient } from '@kit/supabase/server-client';

import { SharePageClient } from './SharePageClient';

interface PageProps {
    params: Promise<{
        token: string;
    }>;
}

export async function generateMetadata({
    params,
}: PageProps) {
    const { token } = await params;

    return {
        title: 'Email Signature Preview',
        description: 'Preview and copy your email signature',
        openGraph: {
            title: 'Email Signature Preview',
            description: 'Preview and copy your email signature',
            url: `/share/${token}`,
        },
    };
}

export default async function SharePage({
    params,
}: PageProps) {
    const { token } = await params;

    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('public_signature_links')
        .select('html, expires_at')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .single();

    if (error || !data) {
        notFound();
    }

    const expiryDate = new Date(data.expires_at).toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }
    );

    return (
        <div className="share-page-container">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
          .share-page-container {
            min-height: 100vh;
            background: #f3f4f6;
            padding: 60px 20px;
            font-family: Inter, system-ui, sans-serif;
          }

          .wrapper {
            max-width: 720px;
            margin: 0 auto;
          }

          .card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 32px;
            box-shadow:
              0 1px 2px rgba(0,0,0,.05),
              0 4px 12px rgba(0,0,0,.06);
          }

          .header {
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 24px;
          }

          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            color: #111827;
          }

          .header p {
            margin-top: 8px;
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          }

          .preview-area {
            background: #ffffff;
            border: 1px dashed #d1d5db;
            border-radius: 12px;
            padding: 20px;
            overflow-x: auto;
            min-height: 220px;
          }

          .preview-area::-webkit-scrollbar {
            height: 8px;
          }

          .preview-area::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 10px;
          }

          .copy-btn {
            margin-top: 24px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #111827;
            color: #ffffff;
            border: none;
            border-radius: 10px;
            padding: 12px 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all .2s ease;
          }

          .copy-btn:hover {
            background: #1f2937;
            transform: translateY(-1px);
          }

          .expiry {
            margin-top: 20px;
            font-size: 13px;
            color: #9ca3af;
          }

          @media (max-width: 768px) {
            .card {
              padding: 20px;
            }

            .header h1 {
              font-size: 22px;
            }

            .preview-area {
              padding: 12px;
            }
          }
        `,
                }}
            />

            <div className="wrapper">
                <div className="card">
                    <div className="header">
                        <h1>Email Signature Preview</h1>
                        <p>
                            Review the signature below, then copy the HTML
                            to use in your email client.
                        </p>
                    </div>

                    <div
                        className="preview-area"
                        dangerouslySetInnerHTML={{
                            __html: data.html,
                        }}
                    />

                    <SharePageClient html={data.html} />

                    <p className="expiry">
                        This link expires on {expiryDate}.
                    </p>
                </div>
            </div>
        </div>
    );
}