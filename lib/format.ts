import type {
  MovieResponse,
  MovieResult,
  MovieResultsResponse,
  Person,
  PersonCombinedCreditsResponse,
  PersonResult,
  SearchMultiResponse,
  SearchPersonResponse,
  ShowResponse,
  TvResult,
  TvResultsResponse,
} from 'moviedb-promise/dist/request-types';
import parseISO from 'date-fns/parseISO';
import compareDesc from 'date-fns/compareDesc';

import { formatShortMonthDate } from './dates';

// Types
export type ListItem = {
  dbId?: string;
  tmdbId: number;
  type: 'movie' | 'tv' | 'person';
  poster?: string;
  title: string;
  subTitle?: string;
};

// Helpers
export const formatMovie = (movie: MovieResult | MovieResponse): ListItem => {
  return {
    tmdbId: movie.id ?? 0,
    type: 'movie',
    poster: movie.poster_path,
    title: movie.title || 'Unknown title',
    subTitle: formatShortMonthDate(movie.release_date),
  };
};

export const formatTvShow = (tvShow: TvResult | ShowResponse): ListItem => {
  return {
    tmdbId: tvShow.id ?? 0,
    type: 'tv',
    poster: tvShow.poster_path ?? undefined,
    title: tvShow.name || 'Unknown name',
    subTitle: formatShortMonthDate(tvShow.first_air_date),
  };
};

export const formatPerson = (person: PersonResult | Person): ListItem => {
  return {
    tmdbId: person.id ?? 0,
    type: 'person',
    poster: person.profile_path ?? undefined,
    title: person.name || 'Unknown name',
  };
};

export const formatSearchAll = (data: SearchMultiResponse): ListItem[] => {
  const { results } = data;

  if (!results) {
    return [];
  }

  return results.map((result) => {
    if ('media_type' in result) {
      switch (result.media_type) {
        case 'movie':
          return formatMovie(result);
        case 'tv':
          return formatTvShow(result);
        default:
          // Force typing as data matches but types don't
          return formatPerson(result as PersonResult);
      }
    } else {
      // No media type for person results
      return formatPerson(result);
    }
  });
};

export const formatSearchMovie = (data: MovieResultsResponse): ListItem[] => {
  const { results } = data;

  if (!results) {
    return [];
  }

  return results.map((result) => formatMovie(result));
};

export const formatSearchTvShow = (data: TvResultsResponse): ListItem[] => {
  const { results } = data;

  if (!results) {
    return [];
  }

  return results.map((result) => formatTvShow(result));
};

export const formatSearchPerson = (data: SearchPersonResponse): ListItem[] => {
  const { results } = data;

  if (!results) {
    return [];
  }

  return results.map((result) => formatPerson(result));
};

export const formatPersonCredits = (data: PersonCombinedCreditsResponse): ListItem[] => {
  const { cast } = data;

  if (!cast) {
    return [];
  }

  // First, sort the data (ignoring those yet to be released)
  const sortedData = cast
    .filter((item) => item.release_date || item.first_air_date)
    .sort((a, b) => {
      const aDate = a.release_date
        ? parseISO(a.release_date)
        : a.first_air_date
        ? parseISO(a.first_air_date)
        : new Date();
      const bDate = b.release_date
        ? parseISO(b.release_date)
        : b.first_air_date
        ? parseISO(b.first_air_date)
        : new Date();

      return compareDesc(aDate, bDate);
    });

  return sortedData
    .map((result): ListItem | undefined => {
      if ('media_type' in result) {
        if (result.media_type === 'movie') {
          return formatMovie(result as MovieResult);
        } else if (result.media_type === 'tv') {
          return formatTvShow(result as TvResult);
        } else {
          // No matching type
          return undefined;
        }
      } else {
        // No matching type
        return undefined;
      }
    })
    .filter((item: ListItem | undefined): item is ListItem => {
      return item !== undefined;
    });
};
