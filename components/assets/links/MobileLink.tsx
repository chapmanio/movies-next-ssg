import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { AnchorHTMLAttributes } from 'react';

// Types
interface MobileLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'aria-current'> {
  href: LinkProps['href'];
}

// Component
const MobileLink: React.FC<MobileLinkProps> = ({ href, ...rest }) => {
  // Hooks
  const { asPath } = useRouter();

  // Derived state
  const match = asPath === href;

  // Render
  return (
    <Link href={href}>
      <a
        className={
          `block border-l-4 py-2 pl-3 pr-4 text-base font-medium` +
          (match
            ? ` border-indigo-500 bg-indigo-50 text-indigo-700`
            : ` border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800`)
        }
        aria-current={match ? 'page' : undefined}
        {...rest}
      />
    </Link>
  );
};

export default MobileLink;
