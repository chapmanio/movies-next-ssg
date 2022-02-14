import Link from 'next/link';
import Image from 'next/image';
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/solid';

import type { ListItem as ListItemType } from '../../lib/format';
import type { List } from '../../lib/api/types';
import { useListModalDispatch } from '../../hooks/useListModal';

// Types
type ListItemBase = {
  item: ListItemType;
  showType?: boolean;
};

interface ListItemNoAction extends ListItemBase {
  action: undefined;
}

interface ListItemAdd extends ListItemBase {
  action: 'add';
}

interface ListItemRemove extends ListItemBase {
  action: 'remove';
  list: List;
}

type ListItemProps = ListItemNoAction | ListItemAdd | ListItemRemove;

// Component
const ListItem = ({ showType = true, ...rest }: ListItemProps) => {
  // Hooks
  const listModalDispatch = useListModalDispatch();

  // Derived state
  const { tmdbId, type, poster, title, subTitle } = rest.item;

  // Render
  return (
    <div className="relative">
      {showType ? (
        <span
          className={
            `pointer-events-none absolute top-2 left-2 z-10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white shadow` +
            (type === 'movie'
              ? ` bg-blue-600`
              : type === 'tv'
              ? ` bg-fuchsia-600`
              : type === 'person'
              ? ` bg-green-600`
              : ``)
          }
        >
          {type === 'movie'
            ? 'Movie'
            : type === 'tv'
            ? 'TV Show'
            : type === 'person'
            ? 'Person'
            : ''}
        </span>
      ) : null}

      {rest.action === 'add' ? (
        <button
          type="button"
          className={
            `absolute -top-3 -right-3 z-10 inline-flex items-center rounded-full border border-transparent p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2` +
            (type === 'movie'
              ? ` bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500`
              : type === 'tv'
              ? ` bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200 focus:ring-fuchsia-500`
              : type === 'person'
              ? ` bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500`
              : ``)
          }
          onClick={() =>
            listModalDispatch({
              type: 'SHOW_ADD_MODAL',
              item: rest.item,
            })
          }
        >
          <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : rest.action === 'remove' ? (
        <button
          type="button"
          className={
            `absolute -top-3 -right-3 z-10 inline-flex items-center rounded-full border border-transparent p-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2` +
            (type === 'movie'
              ? ` bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500`
              : type === 'tv'
              ? ` bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200 focus:ring-fuchsia-500`
              : type === 'person'
              ? ` bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500`
              : ``)
          }
          onClick={() =>
            listModalDispatch({
              type: 'SHOW_REMOVE_MODAL',
              list: rest.list,
              item: rest.item,
            })
          }
        >
          <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}

      <Link href={`/${type}/${tmdbId}`}>
        <a className="group aspect-w-2 aspect-h-3 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
          {poster && (
            <Image
              src={`https://www.themoviedb.org/t/p/w220_and_h330_face${poster}`}
              alt=""
              layout="fill"
              className="pointer-events-none object-cover group-hover:opacity-75"
            />
          )}

          <button type="button" className="absolute inset-0 focus:outline-none">
            <span className="sr-only">View details for {title}</span>
          </button>
        </a>
      </Link>

      <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
        {title}
      </p>
      <p className="pointer-events-none block text-sm font-medium text-gray-500">{subTitle}</p>
    </div>
  );
};

export default ListItem;
