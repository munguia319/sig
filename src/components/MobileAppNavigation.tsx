'use client';

import Link from 'next/link';
import { Bars3Icon } from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/core/ui/Dropdown';

import Trans from '~/core/ui/Trans';

import NAVIGATION_CONFIG from '../navigation.config';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

const MobileAppNavigation = () => {
  const currentOrganization = useCurrentOrganization();

  if (!currentOrganization?.uuid) {
    return null;
  }

  const Links = NAVIGATION_CONFIG(currentOrganization.uuid).items.map(
    (item) => {
      return (
        <DropdownMenuItem key={item.path}>
          <Link
            href={item.path}
            className={'flex h-full w-full items-center space-x-4'}
          >
            <item.Icon className={'h-5'} />

            <span>
              <Trans i18nKey={item.label} defaults={item.label} />
            </span>
          </Link>
        </DropdownMenuItem>
      );
    },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Bars3Icon className={'h-9'} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>{Links}</DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileAppNavigation;
