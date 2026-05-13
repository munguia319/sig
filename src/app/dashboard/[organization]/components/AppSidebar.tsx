import React, { useContext } from 'react';

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

import classNames from 'clsx';

import AppSidebarNavigation from './AppSidebarNavigation';
import Sidebar, { SidebarContent } from '~/core/ui/Sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/core/ui/Tooltip';

import Trans from '~/core/ui/Trans';
import SidebarContext from '~/lib/contexts/sidebar';
import ProfileDropdown from '~/components/ProfileDropdown';
import useUserSession from '~/core/hooks/use-user-session';
import useSignOut from '~/core/hooks/use-sign-out';

import HeaderSubscriptionStatusBadge from '~/app/dashboard/[organization]/components/organizations/HeaderSubscriptionStatusBadge';
import OrganizationsSelector from '~/app/dashboard/[organization]/components/organizations/OrganizationsSelector';

const AppSidebar: React.FC<{
  organizationUid: string;
}> = ({ organizationUid }) => {
  const ctx = useContext(SidebarContext);

  return (
    <Sidebar collapsed={ctx.collapsed}>
      <SidebarContent className={'mt-4'}>
        <OrganizationsSelector displayName={!ctx.collapsed} />
      </SidebarContent>

      <SidebarContent>
        <AppSidebarNavigation organization={organizationUid} />
      </SidebarContent>

      <div className={'absolute bottom-0 w-full'}>
        <SidebarContent>
          <ProfileDropdownContainer collapsed={ctx.collapsed} />
        </SidebarContent>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;

function AppSidebarFooterMenu() {
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  return <CollapsibleButton collapsed={collapsed} onClick={setCollapsed} />;
}

function CollapsibleButton({
  collapsed,
  onClick,
}: React.PropsWithChildren<{
  collapsed: boolean;
  onClick: (collapsed: boolean) => void;
}>) {
  const className = classNames(
    `bg-background absolute -right-[10px] bottom-[30px] cursor-pointer block`,
  );

  const iconClassName =
    'bg-background text-gray-300 dark:text-gray-600 h-5 w-5';

  return (
    <Tooltip>
      <TooltipTrigger
        className={className}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={() => onClick(!collapsed)}
      >
        <ArrowRightCircleIcon
          className={classNames(iconClassName, {
            hidden: !collapsed,
          })}
        />

        <ArrowLeftCircleIcon
          className={classNames(iconClassName, {
            hidden: collapsed,
          })}
        />
      </TooltipTrigger>

      <TooltipContent sideOffset={20}>
        <Trans i18nKey={'common:expandSidebar'} />
      </TooltipContent>
    </Tooltip>
  );
}

function ProfileDropdownContainer(props: { collapsed: boolean }) {
  const userSession = useUserSession();
  const signOut = useSignOut();

  return (
    <div
      className={classNames('flex flex-col space-y-4', {
        ['py-4']: !props.collapsed,
        ['py-6']: props.collapsed,
      })}
    >
      <HeaderSubscriptionStatusBadge />

      <ProfileDropdown
        displayName={!props.collapsed}
        className={'w-full'}
        userSession={userSession}
        signOutRequested={signOut}
      />

      <AppSidebarFooterMenu />
    </div>
  );
}
