// RAWG API Game interface
export interface RawgGame {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  ratings?: {
    id: number;
    title: string;
    count: number;
    percent: number;
  }[];
  released: string;
  tba?: boolean;
  genres: { id: number; name: string }[];
  metacritic?: number;
  platforms?: { platform: { id: number; name: string; slug: string } }[];
  description_raw?: string;
  description?: string;
  website?: string;
  parents_count?: number;
  additions_count?: number;
  game_series_count?: number;
  achievements_count?: number;
  tags?: {
    id: number;
    name: string;
    slug: string;
    language?: string;
    games_count?: number;
    image_background?: string;
  }[];
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  parent_games?: RawgGame[];
}

export interface GameTrailer {
  file: string; // MP4 URL
  preview: string; // Thumbnail
  name?: string;
}

export interface DLC {
  id: number;
  name: string;
  background_image: string | null;
  released: string | null;
}

export interface Screenshot {
  id: number;
  image: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  image: string | null;
  percent: string;
}

// GameDetail interface represents detailed information about a game
export interface GameDetail {
  id: number;
  name: string;
  genres: { id: number; name: string }[];
  rating: number;
  metacritic: string | null;
  metacritic_url?: string | null;
  description: string;
  description_raw?: string;
  released: string;
  website: string | null;
  tba: boolean;
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  background_image: string | null;
  screenshots: Screenshot[];
  platforms?: { platform: { id: number; name: string; slug?: string } }[];
  tags?: { id: number; name: string }[];
  dlcs: DLC[];
  parent_games: { id: number; name: string; background_image: string | null }[];
  series_games: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
  }[];
  achievements: Achievement[];
  suggested_games: {
    id: number;
    name: string;
    background_image: string | null;
    released: string | null;
  }[];
  ratings?: {
    id: number;
    title: string;
    count: number;
    percent: number;
  }[];
  reviews_text_count?: number;
}
