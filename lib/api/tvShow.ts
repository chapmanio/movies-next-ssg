import type { CreditsResponse, TvResultsResponse } from 'moviedb-promise/dist/request-types';

import { apiFetch, ExtShowResponse } from '../api';

// Types
type SearchArgs = {
  query: string;
  page: number;
};

type GetArgs = {
  id: number;
};

// Exports
export const searchTv = async ({ query, page }: SearchArgs) => {
  return apiFetch<TvResultsResponse>(`/tv/search?query=${query}&page=${page}`);
};

export const getTvShow = async ({ id }: GetArgs) => {
  return apiFetch<ExtShowResponse>(`/tv/${id}`);
};

export const getTvCredits = async ({ id }: GetArgs) => {
  return apiFetch<CreditsResponse>(`/tv/${id}/credits`);
};
