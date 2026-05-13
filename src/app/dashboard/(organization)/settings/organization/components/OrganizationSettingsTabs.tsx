import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import MobileNavigationDropdown from '~/core/ui/MobileNavigationDropdown';

const getLinks = () => ({
  General: {
    path: `/dashboard/settings/organization`,
    label: 'organization:generalTabLabel',
  },
  Members: {
    path: '/dashboard/settings/organization/members',
    label: 'organization:membersTabLabel',
  },
});

const OrganizationSettingsTabs: React.FC = () => {
  const itemClassName = `flex justify-center lg:justify-start items-center w-full`;
  const links = getLinks();

  return (
    <>
      <div className={'hidden h-full min-w-[12rem] lg:flex'}>
        <NavigationMenu vertical pill>
          <NavigationItem
            depth={0}
            className={itemClassName}
            link={links.General}
          />

          <NavigationItem className={itemClassName} link={links.Members} />
        </NavigationMenu>
      </div>

      <div className={'block w-full lg:hidden'}>
        <MobileNavigationDropdown links={Object.values(links)} />
      </div>
    </>
  );
};

export default OrganizationSettingsTabs;
