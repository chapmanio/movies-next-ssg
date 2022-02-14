import type {
  Person,
  PersonCombinedCreditsResponse,
  SearchPersonResponse,
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
export const searchPerson = async ({ query, page }: SearchArgs) => {
  return apiFetch<SearchPersonResponse>(`/person/search?query=${query}&page=${page}`);
};

export const getPerson = async ({ id }: GetArgs) => {
  return apiFetch<Person>(`/person/${id}`);
};

export const getPersonCredits = async ({ id }: GetArgs) => {
  return apiFetch<PersonCombinedCreditsResponse>(`/person/${id}/credits`);
};
