'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { createSupabaseBrowserClient } from '@kit/supabase/browser-client';
import Button from '~/core/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/core/ui/Table';

interface SignaturesTableProps {
  organizationId: string;
}

interface Signature {
  id: string;
  employee_name: string;
  created_at: string;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = (fullName || '').trim().split(/\s+/);
  const firstName = parts[0] ?? '';
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
}

export default function SignaturesTable({ organizationId }: SignaturesTableProps) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSignatures() {
      const client = createSupabaseBrowserClient();
      const { data, error } = await client
        .from('email_signatures')
        .select('id, employee_name, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching signatures', error);
        toast.error('Failed to load signatures');
      } else {
        setSignatures(data || []);
      }
      setIsLoading(false);
    }

    loadSignatures();
  }, [organizationId]);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading signatures...</div>;
  }

  if (signatures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
        <p className="text-sm text-gray-500 mb-4">No signatures found.</p>
        <Button asChild variant="outline">
          <Link href={`/dashboard/${organizationId}/signatures/templates`}>
            Create your first signature
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signatures.map((sig) => {
            const { firstName, lastName } = splitName(sig.employee_name);
            return (
              <TableRow key={sig.id}>
                <TableCell className="font-medium">{firstName || '-'}</TableCell>
                <TableCell>{lastName || '-'}</TableCell>
                <TableCell>{new Date(sig.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/${organizationId}/signatures/editor?id=${sig.id}`}>
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
