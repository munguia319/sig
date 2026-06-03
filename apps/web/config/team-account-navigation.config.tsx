import { PenLine } from 'lucide-react';

export const navigationConfig = (account: string) => [
  {
    label: 'Email Signatures',
    path: `/home/${account}/signature`,
    Icon: <PenLine className="w-4 h-4" />,
  }
];
