export type ListItem = {
  id: string;
  listId: string;
  mediaType: 'MOVIE' | 'TV' | 'PERSON';
  tmdbId: number;
  title: string;
  subtitle: string;
  posterUrl: string;
};

export type List = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  items?: ListItem[];
};

export type User = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  lists: List[];
};
