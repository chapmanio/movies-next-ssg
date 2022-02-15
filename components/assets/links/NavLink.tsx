import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { AnchorHTMLAttributes } from 'react';

// Types
interface NavLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'aria-current'> {
  href: LinkProps['href'];
}

// Component
const NavLink: React.FC<NavLinkProps> = ({ href, ...rest }) => {
  // Hooks
  const { asPath } = useRouter();

  // Derived state
  const match = asPath === href;

  // Render
  return (
    <Link href={href}>
      <a
        className={
          `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium` +
          (match
            ? ` border-indigo-500 text-gray-900`
            : ` border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700`)
        }
        aria-current={match ? 'page' : undefined}
        {...rest}
      />
    </Link>
  );
};

export default NavLink;
