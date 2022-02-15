import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { SearchIcon } from '@heroicons/react/solid';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import md5 from 'md5';

import NavLink from '../assets/links/NavLink';
import MobileLink from '../assets/links/MobileLink';
import Footer from './Footer';

import { useUserState, useUserDispatch } from '../../hooks/useUser';

import { signOut } from '../../lib/api/auth';
import { ApiError } from '../../lib/api';

const DetailsLayout: React.FC = ({ children }) => {
  // Hooks
  const userState = useUserState();
  const userDispatch = useUserDispatch();

  // Local state
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showSubNav, setShowSubNav] = useState(false);

  // Refs
  const mobileNavRef = useRef<HTMLButtonElement>(null);
  const subNavRef = useRef<HTMLButtonElement>(null);

  // Effects
  useEffect(() => {
    const outsideClickListener = (event: MouseEvent) => {
      const element = event.target as Element;

      const mobileNav = mobileNavRef.current;
      const subNav = subNavRef.current;

      if (mobileNav && !mobileNav.contains(element)) {
        setShowMobileNav(false);
      }

      if (subNav && !subNav.contains(element)) {
        setShowSubNav(false);
      }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
      document.removeEventListener('click', outsideClickListener);
    };
  }, []);

  // Handers
  const handleSubNav = (event: React.MouseEvent) => {
    // To enable document.click event listener above
    event.stopPropagation();

    setShowSubNav((show) => !show);
    setShowMobileNav(false);
  };

  const handleMobileNav = (event: React.MouseEvent) => {
    // To enable document.click event listener above
    event.stopPropagation();

    setShowMobileNav((show) => !show);
    setShowSubNav(false);
  };

  const handleSignOut = () => {
    signOut()
      .then(() => {
        userDispatch({ type: 'SET_USER', user: { auth: false } });
      })
      .catch((error: ApiError) => {
        userDispatch({ type: 'ERROR', error });
      });
  };

  // Render
  return (
    <>
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div className="flex flex-1">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/">
                  <a className="text-2xl font-bold text-gray-900 sm:tracking-tight md:text-4xl">
                    Movies
                  </a>
                </Link>
              </div>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                {userState.status === 'pending' ? (
                  <div className="h-4 w-14 animate-pulse rounded-md bg-gray-100" />
                ) : userState.status === 'resolved' && userState.data.auth ? (
                  <NavLink href="/lists">My lists</NavLink>
                ) : (
                  <>
                    <NavLink href="/sign-in">Sign in</NavLink>
                    <NavLink href="/register">Create account</NavLink>
                  </>
                )}
              </div>
            </div>
            <form
              method="get"
              action="/"
              className="ml-2 w-full max-w-xs self-center sm:ml-6 lg:max-w-lg"
            >
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative rounded-md text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  id="search"
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                />
              </div>
            </form>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3">
                {userState.status === 'resolved' && userState.data.auth ? (
                  <>
                    <div>
                      <button
                        type="button"
                        className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        id="user-menu-button"
                        aria-expanded={showSubNav}
                        aria-haspopup="true"
                        ref={subNavRef}
                        onClick={handleSubNav}
                      >
                        <span className="sr-only">Open user menu</span>

                        <Image
                          src={`https://www.gravatar.com/avatar/${md5(
                            userState.data.user.email
                          )}?s=56&r=pg`}
                          alt=""
                          height={32}
                          width={32}
                          className="h-8 w-8 rounded-full"
                        />
                      </button>
                    </div>

                    <div
                      className={
                        `absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none` +
                        (showSubNav
                          ? ` scale-100 opacity-100 duration-100 ease-out`
                          : ` scale-95 opacity-0 duration-75 ease-in`)
                      }
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      tabIndex={-1}
                    >
                      <Link href="/my-account">
                        <a
                          role="menuitem"
                          tabIndex={-1}
                          id="user-menu-item-0"
                          className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My account
                        </a>
                      </Link>

                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        id="user-menu-item-1"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="ml-2 -mr-2 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-controls="mobile-menu"
                aria-expanded={showMobileNav}
                ref={mobileNavRef}
                onClick={handleMobileNav}
              >
                <span className="sr-only">Open main menu</span>

                <MenuIcon className={`h-6 w-6` + (showMobileNav ? ` hidden` : ` block`)} />
                <XIcon className={`h-6 w-6` + (showMobileNav ? ` block` : ` hidden`)} />
              </button>
            </div>
          </div>
        </div>

        {showMobileNav ? (
          <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 pt-2 pb-3">
              {userState.status === 'resolved' && userState.data.auth ? (
                <MobileLink href="/lists">My lists</MobileLink>
              ) : (
                <>
                  <MobileLink href="/sign-in">Sign in</MobileLink>
                  <MobileLink href="/register">Create account</MobileLink>
                </>
              )}
            </div>

            {userState.status === 'resolved' && userState.data.auth ? (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={`https://www.gravatar.com/avatar/${md5(
                        userState.data.user.email
                      )}?s=64&r=pg`}
                      alt=""
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="break-words text-base font-medium text-gray-800">
                      {userState.data.user.name}
                    </div>
                    <div className="break-all text-sm font-medium text-gray-500">
                      {userState.data.user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link href="/my-account">
                    <a className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                      My account
                    </a>
                  </Link>

                  <button
                    type="button"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </nav>

      {children}

      <Footer />
    </>
  );
};

export default DetailsLayout;
