import Link from 'next/link';

import LinkedInIcon from '../assets/icons/LinkedIn';
import TwitterIcon from '../assets/icons/Twitter';
import GitHubIcon from '../assets/icons/GitHub';

import { useUserDispatch, useUserState } from '../../hooks/useUser';

import { signOut } from '../../lib/api/auth';
import { ApiError } from '../../lib/api';

const Footer = () => {
  // Hooks
  const userState = useUserState();
  const userDispatch = useUserDispatch();

  // Handlers
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
      <footer className="bg-white">
        <div className="mx-auto mt-8 max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            {userState.status === 'pending' ? (
              <>
                <div className="mt-1 animate-pulse px-5 py-2">
                  <div className="h-5 w-14 rounded-md bg-gray-100" />
                </div>
                <div className="mt-1 animate-pulse px-5 py-2">
                  <div className="h-5 w-20 rounded-md bg-gray-100" />
                </div>
                <div className="mt-1 animate-pulse px-5 py-2">
                  <div className="h-5 w-14 rounded-md bg-gray-100" />
                </div>
              </>
            ) : userState.status === 'resolved' && userState.data.auth ? (
              <>
                <div className="px-5 py-2">
                  <Link href="/lists">
                    <a className="text-base text-gray-500 hover:text-gray-900">My lists</a>
                  </Link>
                </div>
                <div className="px-5 py-2">
                  <Link href="/my-account">
                    <a className="text-base text-gray-500 hover:text-gray-900">My account</a>
                  </Link>
                </div>

                <div className="px-5 py-2">
                  <button
                    type="button"
                    className="text-base text-gray-500 hover:text-gray-900"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-2">
                  <Link href="/sign-in">
                    <a className="text-base text-gray-500 hover:text-gray-900">Sign in</a>
                  </Link>
                </div>
                <div className="px-5 py-2">
                  <Link href="/register">
                    <a className="text-base text-gray-500 hover:text-gray-900">Create account</a>
                  </Link>
                </div>
              </>
            )}
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a
              href="https://uk.linkedin.com/in/chapmanio"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon className="h-6 w-6" />
            </a>

            <a href="https://twitter.com/chapmanio" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" />
            </a>

            <a href="https://github.com/chapmanio" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <GitHubIcon className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()}{' '}
            <a href="https://chapmanio.dev" className="hover:underline">
              chapmanio.dev
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
