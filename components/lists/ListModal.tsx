import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import Modal from '../assets/Modal';
import Alert from '../assets/Alert';
import Notification, { NotificationProps } from '../assets/Notification';

import { useUserState } from '../../hooks/useUser';
import { useListState, useListDispatch } from '../../hooks/useList';
import { useListModalDispatch, useListModalState } from '../../hooks/useListModal';

import { ApiError } from '../../lib/api';
import { addList, addListItem, deleteListItem, getAllLists } from '../../lib/api/lists';

// Types
type NotificationType = Omit<NotificationProps, 'onClose'>;

// Component
const ListModal = () => {
  // Hooks
  const router = useRouter();
  const userState = useUserState();
  const listState = useListState();
  const listDispatch = useListDispatch();
  const listModalState = useListModalState();
  const listModalDispatch = useListModalDispatch();

  // Local state
  const [list, setList] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<NotificationType | undefined>(undefined);

  // Effects
  useEffect(() => {
    // When/if we have an authed user, get their lists
    if (
      listModalState.item &&
      listModalState.operation &&
      userState.status === 'resolved' &&
      userState.data.auth &&
      listState.lists.status !== 'resolved'
    ) {
      // If we have an authed user, get their lists as well
      getAllLists()
        .then((lists) => {
          listDispatch({ type: 'SET_LISTS', lists });
        })
        .catch((error: ApiError) => {
          listDispatch({ type: 'LISTS_ERROR', error });
        });
    }
  }, [listModalState, userState, listState.lists.status, listDispatch]);

  useEffect(() => {
    if (listState.lists.status === 'resolved' && listState.lists.data.length > 0) {
      const selectedList = listState.selectedSlug
        ? listState.lists.data.find((list) => list.slug === listState.selectedSlug)
        : undefined;

      setList(selectedList ? selectedList.slug : listState.lists.data[0].slug);
    }
  }, [listState]);

  useEffect(() => {
    if (listModalState.visible) {
      setSubmitLoading(false);
      setNotification((notification) =>
        notification ? { ...notification, visible: false } : undefined
      );
    }
  }, [listModalState.visible]);

  // Handlers
  const handleAddList = () => {
    setSubmitLoading(true);

    // First, add the list
    if (listModalState.visible && listModalState.operation === 'add') {
      const { tmdbId, title, type, poster, subTitle } = listModalState.item;

      addList(name)
        .then((newList) => {
          listDispatch({ type: 'ADD_LIST', list: newList });

          addListItem({
            listSlug: newList.slug,
            mediaType: type.toUpperCase(), // TODO: type safety?
            tmdbId,
            title,
            subtitle: subTitle,
            posterUrl: poster,
          })
            .then((listItem) => {
              listDispatch({ type: 'ADD_LIST_ITEM', slug: newList.slug, item: listItem });

              setNotification({
                type: 'success',
                title: 'Added to list',
                visible: true,
              });

              listModalDispatch({ type: 'HIDE_MODAL' });
            })
            .catch((error: ApiError) => {
              setSubmitLoading(false);
              setError(error.message);
            });
        })
        .catch((error: ApiError) => {
          if (error.status === 422) {
            setSubmitLoading(false);
            setError('A list with this name already exists');
          } else {
            setSubmitLoading(false);
            setError(error.message);
          }
        });
    }
  };

  const handleAddToList = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitLoading(true);

    if (list && listModalState.visible && listModalState.operation === 'add') {
      const { tmdbId, title, type, poster, subTitle } = listModalState.item;

      addListItem({
        listSlug: list,
        mediaType: type.toUpperCase(), // TODO: type safety?
        tmdbId,
        title,
        subtitle: subTitle,
        posterUrl: poster,
      })
        .then((listItem) => {
          listDispatch({ type: 'ADD_LIST_ITEM', slug: list, item: listItem });

          setNotification({
            type: 'success',
            title: 'Added to list',
            visible: true,
          });

          listModalDispatch({ type: 'HIDE_MODAL' });
        })
        .catch((error: ApiError) => {
          if (error.status === 422) {
            setNotification({
              type: 'info',
              title: 'Item already added to list',
              visible: true,
            });

            listModalDispatch({ type: 'HIDE_MODAL' });
          } else {
            setSubmitLoading(false);
            setError('Unable to add to list');
          }
        });
    }
  };

  const handleRemoveFromList = () => {
    setSubmitLoading(true);

    if (
      listModalState.visible &&
      listModalState.operation === 'remove' &&
      listModalState.item.dbId
    ) {
      const { dbId } = listModalState.item;

      deleteListItem({
        listSlug: listModalState.list.slug,
        listItemId: dbId,
      })
        .then(() => {
          listDispatch({
            type: 'REMOVE_LIST_ITEM',
            slug: listModalState.list.slug,
            itemId: dbId,
          });

          setNotification({
            type: 'success',
            title: 'Removed from list',
            visible: true,
          });

          listModalDispatch({ type: 'HIDE_MODAL' });
        })
        .catch((error: ApiError) => {
          setSubmitLoading(false);
          setError(error.message);
        });
    }
  };

  const handleSignedOut = () => {
    listModalDispatch({ type: 'HIDE_MODAL' });

    router.push('/sign-in');
  };

  // Render
  return (
    <>
      <Modal
        visible={listModalState.visible}
        title={listModalState.item?.title ?? 'Hidden modal'}
        canClose={true}
        onClose={() => listModalDispatch({ type: 'HIDE_MODAL' })}
      >
        {listModalState.item && listModalState.operation ? (
          <div className="flex flex-col items-center space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
            <div className="w-36">
              <div className="aspect-w-2 aspect-h-3 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                {listModalState.item.poster && (
                  <Image
                    src={`https://www.themoviedb.org/t/p/w220_and_h330_face${listModalState.item.poster}`}
                    alt=""
                    layout="fill"
                    className="pointer-events-none object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex-1">
              <span
                className={
                  `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white` +
                  (listModalState.item.type === 'movie'
                    ? ` bg-blue-600`
                    : listModalState.item.type === 'tv'
                    ? ` bg-fuchsia-600`
                    : listModalState.item.type === 'person'
                    ? ` bg-green-600`
                    : ``)
                }
              >
                {listModalState.item.type === 'movie'
                  ? 'Movie'
                  : listModalState.item.type === 'tv'
                  ? 'TV Show'
                  : listModalState.item.type === 'person'
                  ? 'Person'
                  : ''}
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-7 text-gray-900">
                {listModalState.item.title}
              </h2>
              <p className="pointer-events-none mt-1 block text-sm font-medium text-gray-500">
                {listModalState.item.subTitle}
              </p>

              {error ? (
                <div className="mt-6">
                  <Alert type="error" message={error} onClose={() => setError(undefined)} />
                </div>
              ) : null}

              {userState.status === 'resolved' && userState.data.auth ? (
                <>
                  {listModalState.operation === 'add' ? (
                    <div className="mt-6">
                      {listState.lists.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <div className="h-9 w-2/3 animate-pulse rounded-md bg-gray-100" />
                          <div className="h-9 w-1/3 animate-pulse rounded-md bg-gray-100" />
                        </div>
                      ) : listState.lists.status === 'resolved' ? (
                        <>
                          {listState.lists.data.length > 0 ? (
                            <form className="flex space-x-2" onSubmit={handleAddToList}>
                              <select
                                id="list"
                                name="list"
                                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                value={list}
                                onChange={(event) => setList(event.target.value)}
                              >
                                {listState.lists.data.map((list) => (
                                  <option key={list.slug} value={list.slug}>
                                    {list.name}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="submit"
                                className={
                                  `flex-none rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` +
                                  (submitLoading ? ` opacity-75` : ` hover:bg-indigo-700`)
                                }
                                disabled={submitLoading}
                              >
                                {submitLoading ? `Please wait...` : `Add to list`}
                              </button>
                            </form>
                          ) : (
                            <div className="flex space-x-2">
                              <div className="w-full">
                                <label htmlFor="email" className="sr-only">
                                  Email
                                </label>
                                <input
                                  type="text"
                                  name="name"
                                  id="name"
                                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  placeholder="List name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>

                              <button
                                type="button"
                                className={
                                  `flex-none rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2` +
                                  (submitLoading ? ` opacity-75` : ` hover:bg-indigo-700`)
                                }
                                disabled={submitLoading}
                                onClick={handleAddList}
                              >
                                {submitLoading ? `Please wait...` : `Create list`}
                              </button>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  ) : listModalState.operation === 'remove' && listModalState.list ? (
                    <>
                      <p className="mt-5 text-gray-600">
                        Remove from <span className="font-bold">{listModalState.list.name}</span>?
                      </p>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className={
                            `inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm` +
                            (submitLoading ? ` opacity-75` : ` hover:bg-red-700`)
                          }
                          onClick={handleRemoveFromList}
                          disabled={submitLoading}
                        >
                          {submitLoading ? `Please wait...` : `Remove`}
                        </button>
                        <button
                          type="button"
                          className={
                            `mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm` +
                            (submitLoading ? ` opacity-75` : ` hover:bg-gray-50`)
                          }
                          onClick={() => listModalDispatch({ type: 'HIDE_MODAL' })}
                          disabled={submitLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : null}
                </>
              ) : (
                <p className="mt-5 text-red-600">
                  You must be{' '}
                  <button
                    type="button"
                    onClick={handleSignedOut}
                    className="underline hover:text-red-700"
                  >
                    signed in
                  </button>{' '}
                  to{' '}
                  {listModalState.operation === 'add'
                    ? `add to`
                    : listModalState.operation === 'remove'
                    ? `remove from`
                    : `update`}{' '}
                  a list.
                </p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      {notification ? (
        <Notification
          {...notification}
          onClose={() =>
            setNotification((notification) =>
              notification ? { ...notification, visible: false } : undefined
            )
          }
        />
      ) : null}
    </>
  );
};

export default ListModal;
