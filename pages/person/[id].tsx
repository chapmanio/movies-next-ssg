import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type {
  Person as PersonResponse,
  PersonCombinedCreditsResponse,
} from 'moviedb-promise/dist/request-types';
import { useRouter } from 'next/router';
import { LocationMarkerIcon, PlusSmIcon, UserIcon } from '@heroicons/react/solid';
import { CakeIcon } from '@heroicons/react/outline';

import DetailsLayout from '../../components/layouts/Details';
import ListItem from '../../components/lists/ListItem';

import { useListModalDispatch } from '../../hooks/useListModal';

import type { ApiError, ApiResponse } from '../../lib/api';
import { formatAge } from '../../lib/dates';
import { getPerson, getPersonCredits } from '../../lib/api/person';
import { formatPerson, formatPersonCredits, ListItem as ListItemType } from '../../lib/format';

// Component
const Person = () => {
  // Hooks
  const router = useRouter();
  const listModalDispatch = useListModalDispatch();

  // Local state
  const [person, setPerson] = useState<ApiResponse<PersonResponse>>({
    status: 'pending',
  });
  const [credits, setCredits] = useState<ApiResponse<PersonCombinedCreditsResponse>>({
    status: 'pending',
  });
  const [formattedCredits, setFormattedCredits] = useState<ListItemType[]>([]);
  const [showMore, setShowMore] = useState(false);
  // Derived state
  const id = router.query.id ? parseInt(router.query.id.toString()) : 0;

  // Effects
  useEffect(() => {
    let isCancelled = false;

    getPerson({ id })
      .then((data) => {
        if (!isCancelled) {
          setPerson({ status: 'resolved', data });
        }
      })
      .catch((error: ApiError) => {
        if (!isCancelled) {
          setPerson({ status: 'rejected', error });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let isCancelled = false;

    if (person.status === 'resolved') {
      getPersonCredits({ id })
        .then((data) => {
          if (!isCancelled) {
            setCredits({ status: 'resolved', data });
            setFormattedCredits(formatPersonCredits(data));
          }
        })
        .catch((error: ApiError) => {
          if (!isCancelled) {
            setCredits({ status: 'rejected', error });
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [id, person]);

  // Render
  return (
    <DetailsLayout>
      <Head>
        <title>{person.status === 'resolved' ? `${person.data.name} • Movies` : `Movies`}</title>
      </Head>

      <div className="bg-theme-person">
        <div className="mx-auto max-w-7xl items-center px-4 py-8 sm:flex sm:px-6 lg:px-8">
          <div className="flex-none self-start sm:w-[300px]">
            <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg">
              {person.status === 'pending' ? (
                <div className="animate-pulse bg-gray-100" />
              ) : person.status === 'resolved' && person.data.profile_path ? (
                <Image
                  src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${person.data.profile_path}`}
                  alt={person.data.name}
                  layout="fill"
                  className="object-cover"
                />
              ) : (
                <div className="bg-gray-100" />
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-0 sm:ml-10">
            {person.status === 'pending' ? (
              <div className="h-9 w-96 animate-pulse rounded bg-gray-100" />
            ) : person.status === 'resolved' ? (
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl">
                {person.data.name}
              </h2>
            ) : null}

            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                <UserIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />

                {person.status === 'pending' ? (
                  <div className="h-4 w-14 animate-pulse rounded bg-gray-100" />
                ) : person.status === 'resolved' ? (
                  <>
                    {person.data.gender === 1
                      ? `Female`
                      : person.data.gender === 2
                      ? `Male`
                      : `Unknown`}
                  </>
                ) : null}
              </div>

              <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                <CakeIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />

                {person.status === 'pending' ? (
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                ) : person.status === 'resolved' && person.data.birthday ? (
                  <>
                    {person.data.deathday ? `Died ` : null}
                    {formatAge(person.data.birthday, person.data.deathday)} years old
                  </>
                ) : (
                  `Unknown birthday`
                )}
              </div>

              <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                <LocationMarkerIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />

                {person.status === 'pending' ? (
                  <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
                ) : person.status === 'resolved' && person.data.place_of_birth ? (
                  <>{person.data.place_of_birth}</>
                ) : (
                  `Unknown birthplace`
                )}
              </div>
            </div>

            <div className="mt-6">
              {person.status === 'pending' ? (
                <div className="h-9 w-32 animate-pulse rounded bg-gray-100" />
              ) : person.status === 'resolved' ? (
                <button
                  className="inline-flex items-center rounded-md border border-transparent bg-green-100 py-2 pl-4 pr-5 text-sm font-medium text-green-700 shadow-sm hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-700"
                  onClick={() =>
                    listModalDispatch({
                      type: 'SHOW_ADD_MODAL',
                      item: formatPerson(person.data),
                    })
                  }
                >
                  <PlusSmIcon className="mr-2 -ml-1 h-5 w-5" />
                  Add to list
                </button>
              ) : null}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold italic text-gray-200">Biography</h3>
              {person.status === 'pending' ? (
                <div className="mt-1 h-32 w-full animate-pulse rounded bg-gray-100" />
              ) : person.status === 'resolved' && person.data.biography ? (
                <>
                  {person.data.biography.length > 400 ? (
                    <>
                      <p className="mt-1 font-light leading-7 text-gray-200">
                        {showMore
                          ? person.data.biography
                          : `${person.data.biography.substring(0, 400)}...`}
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowMore(!showMore)}
                        className="mt-2 font-semibold text-gray-200"
                      >
                        {showMore ? `Read less` : `Read more`}
                      </button>
                    </>
                  ) : (
                    <p className="mt-1 font-light leading-7 text-gray-200">
                      {person.data.biography}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-1 font-light leading-7 text-gray-200">No biography found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Latest roles</h3>
        </div>

        {credits.status !== 'rejected' ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
            {credits.status === 'pending' ? (
              <>
                {Array(8)
                  .fill(null)
                  .map((_, index) => (
                    <li key={index} className="animate-pulse">
                      <div className="group aspect-w-2 aspect-h-3 block w-full overflow-hidden rounded-lg bg-gray-100" />
                      <div className="mt-2 h-4 w-3/4 rounded bg-gray-100" />
                      <div className="mt-1 h-4 w-1/2 rounded bg-gray-100" />
                    </li>
                  ))}
              </>
            ) : (
              <>
                {formattedCredits.slice(0, 8).map((result) => (
                  <li key={result.tmdbId} className="relative">
                    <ListItem item={result} action="add" />
                  </li>
                ))}
              </>
            )}
          </ul>
        ) : null}
      </div>
    </DetailsLayout>
  );
};

export default Person;
