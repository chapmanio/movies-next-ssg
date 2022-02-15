import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ExclamationCircleIcon } from '@heroicons/react/outline';

import HomeLayout from '../components/layouts/Home';
import Alert from '../components/assets/Alert';
import Notification from '../components/assets/Notification';
import Modal from '../components/assets/Modal';

import { useUserDispatch, useUserState } from '../hooks/useUser';

import { deleteUser, updateUser } from '../lib/api/auth';
import { ApiError } from '../lib/api';
import WithAuth from '../components/assets/WithAuth';

const MyAccount = () => {
  // Hooks
  const router = useRouter();
  const userState = useUserState();
  const userDispatch = useUserDispatch();

  // Local state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);

  // Effects
  useEffect(() => {
    if (userState.status === 'resolved' && userState.data.auth) {
      setName(userState.data.user.name);
      setEmail(userState.data.user.email);
    }
  }, [userState]);

  // Handlers
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userState.status === 'resolved' && userState.data.auth) {
      if (password !== confirm) {
        setError('Passwords do not match');
      } else {
        setError(undefined);
        setSubmitLoading(true);
        setShowComplete(false);
        setShowConfirm(false);

        updateUser({
          name,
          email,
          password,
        })
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

            setSubmitLoading(false);
            setShowComplete(true);
          })
          .catch((error: ApiError) => {
            setSubmitLoading(false);
            setError(error.message);
          });
      }
    }
  };

  const handleRemove = () => {
    setError(undefined);
    setDeleteLoading(true);
    setShowComplete(false);
    setShowConfirm(false);

    deleteUser(email)
      .then(() => {
        userDispatch({
          type: 'SET_USER',
          user: { auth: false },
        });

        // Bounce home
        router.push('/');
      })
      .catch((error: ApiError) => {
        setDeleteLoading(false);
        setError(error.message);
      });
  };

  // Render
  return (
    <WithAuth>
      <HomeLayout>
        <Head>
          <title>My account</title>
        </Head>

        <div className="mx-auto mt-8 max-w-md space-y-6 px-4 sm:mt-16 sm:px-6">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">My account</h2>

          {error ? (
            <Alert type="error" message={error} onClose={() => setError(undefined)} />
          ) : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mt-2 -space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="password"
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
                  (submitLoading || deleteLoading ? ` opacity-75` : ` hover:bg-indigo-700`)
                }
                disabled={submitLoading || deleteLoading}
              >
                {submitLoading ? `Please wait...` : `Update account`}
              </button>
            </div>

            <div>
              <button
                type="button"
                className={
                  `group w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` +
                  (submitLoading || deleteLoading ? ` opacity-75` : ` hover:bg-gray-50`)
                }
                disabled={submitLoading || deleteLoading}
                onClick={() => setShowConfirm(true)}
              >
                {deleteLoading ? `Please wait...` : `Remove account`}
              </button>
            </div>
          </form>
        </div>

        <Notification
          visible={showComplete}
          type="success"
          title="Account updated"
          onClose={() => setShowComplete(false)}
        />

        <Modal title="remove-account-modal" visible={showConfirm} canClose={false}>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                Remove account
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to remove your account? All of your data will be permanently
                  removed from our servers forever. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleRemove}
            >
              Remove
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </HomeLayout>
    </WithAuth>
  );
};

export default MyAccount;
