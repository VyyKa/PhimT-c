export interface Movie {
  id: string;
  title: string;
  description: string;
  image: string;
  backdropImage?: string;
  year: string;
  rating: string;
  duration: string;
  genre: string[];
  videoUrl: string;
  youtubeTrailer?: string;
  driveUrl?: string;
  isFeatured?: boolean;
  category: string;
  cast?: string[];
  director?: string;
  imdbRating?: number;
  reviews?: Review[];
  averageRating?: number;
  sentimentScore?: SentimentScore;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: Date;
}

export interface SentimentScore {
  positive: number;
  neutral: number;
  negative: number;
  overall: 'positive' | 'neutral' | 'negative';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  favoriteMovies: string[];
  watchHistory: string[];
  isAdmin?: boolean;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}