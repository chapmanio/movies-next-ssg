import type {
  CreditsResponse,
  MovieResponse,
  MovieResultsResponse,
} from 'moviedb-promise/dist/request-types';

import { apiFetch } from '../api';

// Types
type SearchArgs = {
  query: string;
  page: number;
};

type GetArgs = {
  id: number;
};

// Exports
export const searchMovie = async ({ query, page }: SearchArgs) => {
  return apiFetch<MovieResultsResponse>(`/movie/search?query=${query}&page=${page}`);
};

export const getMovie = async ({ id }: GetArgs) => {
  return apiFetch<MovieResponse>(`/movie/${id}`);
};

export const getMovieCredits = async ({ id }: GetArgs) => {
  return apiFetch<CreditsResponse>(`/movie/${id}/credits`);
};
