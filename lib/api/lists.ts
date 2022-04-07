import { apiFetch, apiRaw } from '../api';
import type { List, ListItem } from './types';

// Types
type UpdateListArgs = {
  slug: string;
  name: string;
};

type AddListItemArgs = {
  listSlug: string;
  mediaType: string;
  tmdbId: number;
  title: string;
  subtitle?: string;
  posterUrl?: string;
};

type DeleteListItemArgs = {
  listSlug: string;
  listItemId: string;
};

// Handlers
export const getAllLists = async () => {
  return apiFetch<List[]>(`/list`);
};

export const getList = async (slug: string) => {
  return apiFetch<List>(`/list/${slug}`);
};

export const addList = async (name: string) => {
  return apiFetch<List>(`/list`, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
  });
};

export const updateList = async ({ slug, name }: UpdateListArgs) => {
  return apiFetch<List>(`/list/${slug}`, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
  });
};

export const deleteList = async (slug: string) => {
  await apiRaw(`/list/delete/${slug}`, {
    method: 'POST',
  });

  return;
};

export const addListItem = async ({
  listSlug,
  mediaType,
  tmdbId,
  title,
  subtitle,
  posterUrl,
}: AddListItemArgs) => {
  return apiFetch<ListItem>(`/list-item/${listSlug}`, {
    method: 'POST',
    body: JSON.stringify({
      mediaType,
      tmdbId,
      title,
      subtitle,
      posterUrl,
    }),
  });
};

export const deleteListItem = async ({ listSlug, listItemId }: DeleteListItemArgs) => {
  await apiRaw(`/list-item/${listSlug}/delete/${listItemId}`, {
    method: 'POST',
  });

  return;
};
