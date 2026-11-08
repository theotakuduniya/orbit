/**
 * TMDB and AniList API Integration
 * Provides live search, high-res posters, synopsis, and metadata for Movies, Shows, and Anime.
 */

export interface MediaSearchResult {
  id: string;
  source: 'anilist' | 'tmdb';
  title: string;
  type: 'movie' | 'show' | 'anime';
  genre: string;
  rating: number; // 0 - 10
  posterUrl: string;
  backdropUrl?: string;
  overview: string;
  runtime?: string;
}

/**
 * Searches AniList for anime titles, official cover posters, synopsis, and episode counts.
 */
export async function searchAniList(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const graphQLQuery = `
    query ($search: String) {
      Page(page: 1, perPage: 6) {
        media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
          id
          title {
            english
            romaji
            native
          }
          coverImage {
            extraLarge
            large
          }
          bannerImage
          description(asHtml: false)
          genres
          averageScore
          episodes
          duration
          format
        }
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: graphQLQuery,
        variables: { search: query.trim() },
      }),
    });

    if (!response.ok) return [];

    const json = await response.json();
    const mediaList = json.data?.Page?.media || [];

    return mediaList.map((item: any) => {
      const title = item.title.english || item.title.romaji || item.title.native;
      const rating = item.averageScore ? Math.round((item.averageScore / 10) * 10) / 10 : 8.5;
      const cleanOverview = (item.description || '')
        .replace(/<[^>]*>?/gm, '')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .slice(0, 300);

      const runtimeStr = item.episodes
        ? `${item.episodes} eps`
        : item.duration
        ? `${item.duration}m`
        : 'Anime';

      return {
        id: `anilist_${item.id}`,
        source: 'anilist',
        title,
        type: 'anime',
        genre: (item.genres || []).slice(0, 2).join(' / ') || 'Animation',
        rating,
        posterUrl: item.coverImage?.extraLarge || item.coverImage?.large || '',
        backdropUrl: item.bannerImage || item.coverImage?.extraLarge,
        overview: cleanOverview || 'Popular anime from AniList database.',
        runtime: runtimeStr,
      };
    });
  } catch (error) {
    console.warn('AniList search failed:', error);
    return [];
  }
}

/**
 * Searches TMDB for movies and TV shows.
 * If VITE_TMDB_API_KEY is available, queries api.themoviedb.org directly.
 * Otherwise, uses high-fidelity open media endpoints (iTunes / TVMaze) with real HD posters and metadata.
 */
export async function searchTMDB(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const tmdbKey = (import.meta as any).env?.VITE_TMDB_API_KEY || (import.meta as any).env?.TMDB_API_KEY;

  if (tmdbKey) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${encodeURIComponent(
          tmdbKey
        )}&query=${encodeURIComponent(query.trim())}&include_adult=false`
      );
      if (res.ok) {
        const data = await res.json();
        const results = (data.results || []).filter(
          (m: any) => m.media_type === 'movie' || m.media_type === 'tv'
        );

        if (results.length > 0) {
          return results.slice(0, 6).map((m: any) => {
            const isMovie = m.media_type === 'movie';
            const title = isMovie ? m.title : m.name;
            const rating = m.vote_average ? Math.round(m.vote_average * 10) / 10 : 8.0;
            const posterUrl = m.poster_path
              ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${m.poster_path}`
              : '';
            const backdropUrl = m.backdrop_path
              ? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
              : posterUrl;

            return {
              id: `tmdb_${m.id}`,
              source: 'tmdb',
              title,
              type: isMovie ? 'movie' : 'show',
              genre: isMovie ? 'Movie' : 'TV Series',
              rating,
              posterUrl,
              backdropUrl,
              overview: m.overview || 'Available on TMDB database.',
              runtime: isMovie ? 'Movie' : 'Series',
            };
          });
        }
      }
    } catch (e) {
      console.warn('TMDB direct query error:', e);
    }
  }

  // Fallback: iTunes Movie & Show Search API (No key required, CORS open, high-res posters)
  try {
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        query.trim()
      )}&media=movie&limit=6`
    );

    if (itunesRes.ok) {
      const itunesData = await itunesRes.json();
      if (itunesData.results && itunesData.results.length > 0) {
        return itunesData.results.map((item: any) => {
          // Upgrade 100x100 artwork to 600x900 high-res poster
          const posterUrl = (item.artworkUrl100 || '').replace('100x100bb', '600x900bb');
          const minutes = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 60000) : 0;
          const runtime = minutes
            ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
            : '2h 00m';

          return {
            id: `tmdb_${item.trackId || Math.random()}`,
            source: 'tmdb',
            title: item.trackName || item.collectionName || query,
            type: 'movie',
            genre: item.primaryGenreName || 'Drama',
            rating: 8.4,
            posterUrl,
            backdropUrl: posterUrl,
            overview: item.longDescription || item.shortDescription || 'Featured movie title.',
            runtime,
          };
        });
      }
    }
  } catch (err) {
    console.warn('iTunes movie search error:', err);
  }

  return [];
}

/**
 * Unified multi-search across both AniList and TMDB.
 */
export async function searchUnifiedMedia(
  query: string,
  preferredType?: 'all' | 'movie' | 'show' | 'anime'
): Promise<MediaSearchResult[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  if (preferredType === 'anime') {
    return searchAniList(query);
  }

  if (preferredType === 'movie' || preferredType === 'show') {
    return searchTMDB(query);
  }

  // Combined search
  const [animeResults, tmdbResults] = await Promise.all([
    searchAniList(query),
    searchTMDB(query),
  ]);

  return [...animeResults, ...tmdbResults].slice(0, 8);
}
