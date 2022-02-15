import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import type { CreditsResponse } from 'moviedb-promise/dist/request-types';
import { useRouter } from 'next/router';
import { CalendarIcon, ClockIcon, FilmIcon, PlusSmIcon } from '@heroicons/react/solid';

import DetailsLayout from '../../components/layouts/Details';
import Rating from '../../components/assets/Rating';
import ListItem from '../../components/lists/ListItem';

import { useListModalDispatch } from '../../hooks/useListModal';

import type { ApiError, ApiResponse, ExtShowResponse } from '../../lib/api';
import { getTvShow, getTvCredits } from '../../lib/api/tvShow';
import { formatRuntime, formatShortDate, formatYear } from '../../lib/dates';
import { formatTvShow } from '../../lib/format';

const TvShow = () => {
  // Hooks
  const router = useRouter();
  const listModalDispatch = useListModalDispatch();

  // Local state
  const [tvShow, setTvShow] = useState<ApiResponse<ExtShowResponse>>({
    status: 'pending',
  });
  const [credits, setCredits] = useState<ApiResponse<CreditsResponse>>({
    status: 'pending',
  });

  // Derived state
  const id = router.query.id ? parseInt(router.query.id.toString()) : 0;

  // Effects
  useEffect(() => {
    let isCancelled = false;

    getTvShow({ id })
      .then((data) => {
        if (!isCancelled) {
          setTvShow({ status: 'resolved', data });
        }
      })
      .catch((error: ApiError) => {
        if (!isCancelled) {
          setTvShow({ status: 'rejected', error });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let isCancelled = false;

    if (tvShow.status === 'resolved') {
      getTvCredits({ id })
        .then((data) => {
          if (!isCancelled) {
            setCredits({ status: 'resolved', data });
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
  }, [id, tvShow]);

  // Render
  return (
    <DetailsLayout>
      <Head>
        <title>{tvShow.status === 'resolved' ? `${tvShow.data.name} • Movies` : `Movies`}</title>
      </Head>

      <div
        className="bg-cover bg-right-top bg-no-repeat sm:bg-[right_-200px_top]"
        style={{
          backgroundImage:
            tvShow.status === 'resolved' && tvShow.data.backdrop_path
              ? `url(https://www.themoviedb.org/t/p/w1920_and_h800_multi_faces/${tvShow.data.backdrop_path})`
              : undefined,
        }}
      >
        <div className="bg-theme-tv">
          <div className="mx-auto max-w-7xl items-center px-4 py-8 sm:flex sm:px-6 lg:px-8">
            <div className="flex-none self-start sm:w-[300px]">
              <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg">
                {tvShow.status === 'pending' ? (
                  <div className="animate-pulse bg-gray-100" />
                ) : tvShow.status === 'resolved' && tvShow.data.poster_path ? (
                  <Image
                    src={`https://www.themoviedb.org/t/p/w600_and_h900_bestv2${tvShow.data.poster_path}`}
                    alt={tvShow.data.name}
                    layout="fill"
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-100" />
                )}
              </div>
            </div>

            <div className="mt-6 sm:mt-0 sm:ml-10">
              {tvShow.status === 'pending' ? (
                <div className="h-9 w-96 animate-pulse rounded bg-gray-100" />
              ) : tvShow.status === 'resolved' ? (
                <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl">
                  {tvShow.data.name}{' '}
                  <span className="font-extralight text-gray-200">
                    ({formatYear(tvShow.data.first_air_date)})
                  </span>
                </h2>
              ) : null}

              <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                  <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />

                  {tvShow.status === 'pending' ? (
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                  ) : tvShow.status === 'resolved' ? (
                    <>{formatShortDate(tvShow.data.first_air_date)}</>
                  ) : null}
                </div>

                <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                  <FilmIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />

                  {tvShow.status === 'pending' ? (
                    <div className="h-4 w-72 animate-pulse rounded bg-gray-100" />
                  ) : tvShow.status === 'resolved' ? (
                    <>{tvShow.data.genres?.map((genre) => genre.name).join(', ')}</>
                  ) : null}
                </div>

                {tvShow.status === 'pending' ? (
                  <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                    <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
                  </div>
                ) : tvShow.status === 'resolved' && tvShow.data.episode_run_time ? (
                  <div className="mt-2 flex items-center text-sm font-light text-gray-200">
                    <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-300" />
                    {formatRuntime(tvShow.data.episode_run_time[0])}
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex items-center space-x-6">
                {tvShow.status === 'pending' ? (
                  <div className="h-16 w-16 animate-pulse rounded-full bg-gray-100" />
                ) : tvShow.status === 'resolved' && tvShow.data.vote_average ? (
                  <Rating rating={tvShow.data.vote_average} />
                ) : null}

                {tvShow.status === 'pending' ? (
                  <div className="h-9 w-32 animate-pulse rounded bg-gray-100" />
                ) : tvShow.status === 'resolved' ? (
                  <button
                    type="button"
                    className="ml-6 inline-flex items-center rounded-md border border-transparent bg-fuchsia-100 py-2 pl-4 pr-5 text-sm font-medium text-fuchsia-700 shadow-sm hover:bg-fuchsia-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-fuchsia-700"
                    onClick={() =>
                      listModalDispatch({
                        type: 'SHOW_ADD_MODAL',
                        item: formatTvShow(tvShow.data),
                      })
                    }
                  >
                    <PlusSmIcon className="mr-2 -ml-1 h-5 w-5" />
                    Add to list
                  </button>
                ) : null}
              </div>

              <div className="mt-6">
                {tvShow.status === 'pending' ? (
                  <div className="h-6 w-72 animate-pulse rounded bg-gray-100" />
                ) : tvShow.status === 'resolved' && 'tagline' in tvShow.data ? (
                  <h3 className="text-lg font-bold italic text-gray-200">{tvShow.data.tagline}</h3>
                ) : null}
              </div>

              <div className="mt-1">
                {tvShow.status === 'pending' ? (
                  <div className="mt-2 h-20 w-full animate-pulse rounded bg-gray-100" />
                ) : tvShow.status === 'resolved' ? (
                  <p className="font-light leading-7 text-gray-200">{tvShow.data.overview}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-5">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Series cast</h3>
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
                {credits.data.cast?.slice(0, 8).map((result) => (
                  <li key={result.id} className="relative">
                    <ListItem
                      item={{
                        tmdbId: result.id ?? 0,
                        type: 'person',
                        title: result.name ?? 'Unknown name',
                        subTitle: result.character,
                        poster: result.profile_path ?? undefined,
                      }}
                      showType={false}
                      action="add"
                    />
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

export default TvShow;
