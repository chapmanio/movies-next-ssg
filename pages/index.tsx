import { useEffect, useRef, useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { SearchMultiResponse } from 'moviedb-promise/dist/request-types';

import HomeLayout from '../components/layouts/Home';
import Pagination from '../components/search/Pagination';
import TabButton from '../components/search/TabButton';
import ListItem from '../components/lists/ListItem';

import {
  formatSearchAll,
  formatSearchMovie,
  formatSearchPerson,
  formatSearchTvShow,
  ListItem as ListItemType,
} from '../lib/format';
import type { ApiError, ApiResponse } from '../lib/api';
import { searchMovie } from '../lib/api/movie';
import { searchPerson } from '../lib/api/person';
import { searchAll, getTrending } from '../lib/api/search';
import { searchTv } from '../lib/api/tvShow';

// Types
type Tab = 'all' | 'movie' | 'tv' | 'person';

// Component
const Home: NextPage = () => {
  // Hooks
  const router = useRouter();

  // Local state
  const [searchResults, setSearchResults] = useState<ApiResponse<SearchMultiResponse> | undefined>(
    undefined
  );
  const [formattedResults, setFormattedResults] = useState<ListItemType[]>([]);

  // Refs
  const tabRef = useRef<HTMLDivElement>(null);

  // Derived state
  const search = (router.query.search || '') as string;
  const tab = (router.query.tab || 'all') as Tab;
  const page = parseInt((router.query.page as string) || '1');

  // Effects
  useEffect(() => {
    let isCancelled = false;

    setSearchResults({ status: 'pending' });

    if (search && search.trim() !== '') {
      if (tabRef.current) {
        tabRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      switch (tab) {
        case 'all':
          searchAll({
            query: search,
            page,
          })
            .then((data) => {
              if (!isCancelled) {
                setSearchResults({ status: 'resolved', data });
                setFormattedResults(formatSearchAll(data));
              }
            })
            .catch((error: ApiError) => {
              if (!isCancelled) {
                // TODO: Handle error
                setSearchResults({ status: 'rejected', error });
                setFormattedResults([]);
              }
            });

          break;
        case 'movie':
          searchMovie({
            query: search,
            page,
          })
            .then((data) => {
              if (!isCancelled) {
                setSearchResults({ status: 'resolved', data });
                setFormattedResults(formatSearchMovie(data));
              }
            })
            .catch((error: ApiError) => {
              if (!isCancelled) {
                // TODO: Handle error
                setSearchResults({ status: 'rejected', error });
                setFormattedResults([]);
              }
            });

          break;
        case 'tv':
          searchTv({
            query: search,
            page,
          })
            .then((data) => {
              if (!isCancelled) {
                setSearchResults({ status: 'resolved', data });
                setFormattedResults(formatSearchTvShow(data));
              }
            })
            .catch((error: ApiError) => {
              if (!isCancelled) {
                // TODO: Handle error
                setSearchResults({ status: 'rejected', error });
                setFormattedResults([]);
              }
            });

          break;
        case 'person':
          searchPerson({
            query: search,
            page,
          })
            .then((data) => {
              if (!isCancelled) {
                setSearchResults({ status: 'resolved', data });
                setFormattedResults(formatSearchPerson(data));
              }
            })
            .catch((error: ApiError) => {
              if (!isCancelled) {
                // TODO: Handle error
                setSearchResults({ status: 'rejected', error });
                setFormattedResults([]);
              }
            });

          break;
        default:
          // Something went wrong!
          setSearchResults({ status: 'rejected' });
          setFormattedResults([]);

          break;
      }
    } else {
      // Default to trending today
      getTrending()
        .then((data) => {
          if (!isCancelled) {
            setSearchResults({ status: 'resolved', data });
            setFormattedResults(formatSearchAll(data));
          }
        })
        .catch((error: ApiError) => {
          if (!isCancelled) {
            // TODO: Handle error
            setSearchResults({ status: 'rejected', error });
            setFormattedResults([]);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [search, page, tab]);

  // Handlers
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build new query
    const formData = new FormData(event.currentTarget);

    const newQuery = { ...router.query };

    newQuery.page = '1';
    newQuery.search = formData.get('search') as string;

    // Update url
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const changeTab = (tab: Tab) => {
    const newQuery = { ...router.query };

    newQuery.page = '1';
    newQuery.tab = tab;

    // Update url
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  // Render
  return (
    <>
      <Head>
        <title>Movies</title>
      </Head>

      <HomeLayout>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mx-auto mt-5 max-w-xl text-center text-xl text-gray-500">
            Supported by a{` `}
            <a
              href="https://workers.cloudflare.com/"
              rel="nofollow noreferrer"
              className="font-semibold hover:text-indigo-600"
            >
              Cloudflare workers
            </a>{' '}
            hosted API, connecting to a{' '}
            <a
              href="https://www.prisma.io/"
              rel="nofollow noreferrer"
              className="font-semibold hover:text-indigo-600"
            >
              Prisma
            </a>
            -managed database and interacting with{' '}
            <a
              href="https://developers.themoviedb.org/"
              rel="nofollow noreferrer"
              className="font-semibold hover:text-indigo-600"
            >
              The Movie Database
            </a>{' '}
            external API.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-16 max-w-4xl rounded-xl bg-indigo-600 px-4 py-4 sm:flex sm:py-9 sm:px-12"
          >
            <div className="min-w-0 flex-1">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <input
                id="search"
                name="search"
                defaultValue={search || ''}
                type="search"
                className="block w-full rounded-md border border-transparent px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
                placeholder="Search for a movie, tv show or person..."
              />
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                className="block w-full rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:px-10"
              >
                Search
              </button>
            </div>
          </form>

          {searchResults ? (
            <div className="mt-16" ref={tabRef}>
              {!search ? (
                <div className="border-b border-gray-200 pb-5">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Trending today</h3>
                </div>
              ) : (
                <>
                  <div className="sm:hidden">
                    <label htmlFor="tabs" className="sr-only">
                      Select a tab
                    </label>
                    <select
                      id="tabs"
                      name="tabs"
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      value={tab}
                      onChange={(event) => {
                        const newQuery = { ...router.query };

                        newQuery.tab = event.target.value;

                        // Update url
                        router.push(
                          {
                            pathname: router.pathname,
                            query: newQuery,
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      <option value="all">All</option>
                      <option value="movie">Movie</option>
                      <option value="tv">TV Show</option>
                      <option value="person">Person</option>
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <TabButton current={tab === 'all'} onClick={() => changeTab('all')}>
                          All
                        </TabButton>

                        <TabButton current={tab === 'movie'} onClick={() => changeTab('movie')}>
                          Movie
                        </TabButton>

                        <TabButton current={tab === 'tv'} onClick={() => changeTab('tv')}>
                          TV Show
                        </TabButton>

                        <TabButton current={tab === 'person'} onClick={() => changeTab('person')}>
                          Person
                        </TabButton>
                      </nav>
                    </div>
                  </div>
                </>
              )}

              {searchResults.status !== 'rejected' ? (
                <>
                  <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-8 xl:gap-x-12">
                    {searchResults.status === 'pending' ? (
                      <>
                        {Array(20)
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
                        {formattedResults.map((result) => (
                          <li key={result.tmdbId} className="relative">
                            <ListItem item={result} action="add" />
                          </li>
                        ))}
                      </>
                    )}
                  </ul>

                  {search &&
                  searchResults.status === 'resolved' &&
                  searchResults.data.total_pages &&
                  searchResults.data.total_pages > 1 ? (
                    <Pagination
                      currentPage={page}
                      totalPages={searchResults.data.total_pages}
                      onChange={(newPage) => {
                        const newQuery = { ...router.query };

                        newQuery.page = newPage.toString();

                        // Update url
                        router.push(
                          {
                            pathname: router.pathname,
                            query: newQuery,
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    />
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </HomeLayout>
    </>
  );
};

export default Home;
