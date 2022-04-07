import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { DotsVerticalIcon, PencilAltIcon } from '@heroicons/react/solid';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline';

import ListItem from '../lists/ListItem';

import { useListDispatch } from '../../hooks/useList';

import type { List as ListType } from '../../lib/api/types';
import type { ListItem as ListItemType } from '../../lib/format';

// Types
type ListProps = {
  list: ListType;
  onEdit: () => void;
  onDelete: () => void;
};

// Component
const List = ({ list, onEdit, onDelete }: ListProps) => {
  // Hooks
  const router = useRouter();
  const listDispatch = useListDispatch();

  // Derived state
  const { slug, name, items } = list;

  // Local state
  const [showMenu, setShowMenu] = useState(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    const outsideClickListener = (event: MouseEvent) => {
      const element = event.target as Element;

      const menuNav = menuRef.current;

      if (menuNav && !menuNav.contains(element)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', outsideClickListener);

    return () => {
      document.removeEventListener('click', outsideClickListener);
    };
  }, []);

  useEffect(() => {
    // Clear current list on load
    listDispatch({ type: 'CLEAR_SELECTED_LIST' });
  }, [listDispatch]);

  // Handlers
  const handleEdit = () => {
    setShowMenu(false);

    onEdit();
  };

  const handleDelete = () => {
    setShowMenu(false);

    onDelete();
  };

  const handleAddToList = () => {
    // Set global state
    listDispatch({ type: 'SET_SELECTED_LIST', slug });

    // Redirect home
    router.push(`/`);
  };

  // Render
  return (
    <>
      <div className="flex items-center space-x-8">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <div className="relative inline-block text-left" ref={menuRef}>
          <div>
            <button
              type="button"
              className="flex items-center rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
              id="menu-button"
              aria-expanded={showMenu}
              aria-haspopup={showMenu}
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="sr-only">Open options</span>
              <DotsVerticalIcon className="h-5 w-5" />
            </button>
          </div>

          <div
            className={
              `absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none ` +
              (showMenu
                ? ` pointer-events-auto scale-100 opacity-100 duration-100 ease-out`
                : ` pointer-events-none scale-95 opacity-0 duration-75 ease-in`)
            }
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                type="button"
                className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-1"
                onClick={handleEdit}
              >
                <PencilAltIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Edit
              </button>

              <button
                type="button"
                className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-2"
                onClick={handleDelete}
              >
                <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-8 lg:gap-x-8 xl:gap-x-12">
        <li>
          <div className="aspect-w-2 aspect-h-3">
            <button
              type="button"
              className="group w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddToList}
            >
              <div className="px-6">
                <PlusCircleIcon className="mx-auto h-10 w-10 text-gray-300 group-hover:text-gray-400" />
                <p className="mt-2 block text-sm font-medium text-gray-400 group-hover:text-gray-600">
                  Add to this list
                </p>
              </div>
            </button>
          </div>
        </li>

        {items
          ? items.map((item) => (
              <li key={item.id} className="relative">
                <ListItem
                  item={{
                    dbId: item.id,
                    tmdbId: item.tmdbId,
                    type: item.mediaType.toLowerCase() as ListItemType['type'],
                    title: item.title,
                    subTitle: item.subtitle,
                    poster: item.posterUrl,
                  }}
                  action="remove"
                  list={list}
                />
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

export default List;
