import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Alert from '../components/assets/Alert';
import HomeLayout from '../components/layouts/Home';

import { useUserDispatch } from '../hooks/useUser';

import { registerUser } from '../lib/api/auth';
import { ApiError } from '../lib/api';

const Register = () => {
  // Hooks
  const router = useRouter();
  const userDispatch = useUserDispatch();

  // Local state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Handlers
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirm) {
      setError('Passwords do not match');
    } else {
      setError(undefined);
      setSubmitLoading(true);

      registerUser({ name, email, password })
        .then((user) => {
          userDispatch({
            type: 'SET_USER',
            user: {
              auth: true,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            },
          });

          // Bounce home
          router.push('/');
        })
        .catch((error: ApiError) => {
          setSubmitLoading(false);
          setError(error.message);
        });
    }
  };

  // Render
  return (
    <HomeLayout>
      <Head>
        <title>Create account</title>
      </Head>

      <div className="mx-auto mt-10 max-w-md space-y-8 px-4 sm:px-6">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/sign-in">
              <a className="font-medium text-indigo-600 hover:text-indigo-500">
                sign-in to an existing account
              </a>
            </Link>
          </p>
        </div>

        {error ? <Alert type="error" message={error} onClose={() => setError(undefined)} /> : null}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-nonefocus:outline-none relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-nonefocus:outline-none relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm" className="sr-only">
                Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="confirm-password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={
                `group w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` +
                (submitLoading ? ` opacity-75` : ` hover:bg-indigo-700`)
              }
              disabled={submitLoading}
            >
              {submitLoading ? `Please wait...` : `Create account`}
            </button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Register;
