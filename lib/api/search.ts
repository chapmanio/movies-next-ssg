import type { SearchMultiResponse, TrendingResponse } from 'moviedb-promise/dist/request-types';

import { apiFetch } from '../api';

// Types
type SearchArgs = {
  query: string;
  page: number;
};

// Exports
export const getTrending = async () => {
  return apiFetch<TrendingResponse>(`/trending`);
};

export const searchAll = async ({ query, page }: SearchArgs) => {
  return apiFetch<SearchMultiResponse>(`/search?query=${query}&page=${page}`);
};
