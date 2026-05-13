import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

const SettingsTile: React.FCC<{
  heading?: string | React.ReactNode;
  subHeading?: string | React.ReactNode;
  actions?: React.ReactNode;
}> = ({ children, heading, subHeading, actions }) => {
  return (
    <div
      className={
        'rounded-md border border-gray-100 p-2.5 dark:border-dark-800 lg:p-6' +
        ' w-full'
      }
    >
      <div className={'flex flex-col space-y-6'}>
        <div
          className={
            'flex flex-col space-y-4 lg:flex-row lg:space-y-0' +
            ' lg:items-center lg:justify-between'
          }
        >
          <If condition={heading}>
            <div className={'flex flex-col space-y-1'}>
              <Heading type={4}>{heading}</Heading>

              <If condition={subHeading}>
                <p className={'text-gray-500'}>{subHeading}</p>
              </If>
            </div>
          </If>

          <If condition={actions}>{actions}</If>
        </div>

        {children}
      </div>
    </div>
  );
};

export default SettingsTile;
