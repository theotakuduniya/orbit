/**
 * Data types for Orbit Mobile Collaborative Micro-Hub
 */

export interface SpaceMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: string;
  isOnline: boolean;
  currentActivity?: string;
  lastActive: string;
}

export interface Space {
  id: string;
  name: string;
  emoji: string;
  description: string;
  members: SpaceMember[];
  anniversaryOrDate?: string;
}

// Studio: Moodboard
export interface MoodboardItem {
  id: string;
  type: 'photo' | 'note' | 'link' | 'sticker';
  title?: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  rotation: number; // e.g. -3 to 3
  color?: string;
  position: { x: number; y: number };
  likes: number;
  timestamp: string;
}

// Studio: Doodle
export interface DoodleStroke {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  authorId: string;
}

export interface DoodleSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  authorId: string;
}

// Studio: Tier List
export interface TierItem {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
}

export interface TierRow {
  key: 'S' | 'A' | 'B' | 'C' | 'D';
  label: string;
  color: string;
  items: TierItem[];
}

export interface TierListCollection {
  id: string;
  title: string;
  emoji: string;
  category: string;
  tiers: TierRow[];
  stash: TierItem[];
  updatedAt: string;
}

// Media: Memes
export interface VoiceReaction {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  durationSec: number;
  audioBlobUrl?: string;
  timestamp: string;
  waveform: number[];
}

export interface MemeItem {
  id: string;
  imageUrl: string;
  caption: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  fires: number;
  userLiked?: boolean;
  userFired?: boolean;
  timestamp: string;
  voiceReactions: VoiceReaction[];
}

// Media: Music & Video
export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
  addedBy: SpaceMember;
  addedAt: string;
  previewAudioUrl?: string;
  isPlaying?: boolean;
  syncedWithPartner?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  duration: string;
  addedBy: SpaceMember;
  progressPercent: number;
  togetherAt: string;
  youtubeId: string;
}

// Vault: Polymorphic lists
export type DisplayMode = 'cards' | 'compact';

export interface VaultItem {
  id: string;
  title: string;
  caption?: string;
  url?: string;
  imageUrl?: string;
  category: 'restaurant' | 'idea' | 'recipe' | 'travel' | 'link';
  completed?: boolean;
  addedBy: SpaceMember;
  addedAt: string;
  tags?: string[];
}

// Media: Gallery / Photo Dump
export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  type: 'shared' | 'alex' | 'sam';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
}

export interface WatchlistItem {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  posterUrl: string;
  backdropUrl?: string;
  overview: string;
  runtime: string;
  type?: 'movie' | 'show' | 'anime';
  status?: 'want_to_watch' | 'watching' | 'watched';
  watchedBy?: ('alex' | 'sam')[];
  reactions?: {
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    emoji: string;
  }[];
  swipedByMe?: 'liked' | 'passed';
  swipedByPartner?: 'liked' | 'passed';
  isMatch?: boolean;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: 'Travel' | 'Adventure' | 'Food' | 'Milestone';
  targetDate?: string;
  completed: boolean;
  createdById?: string;
  createdByName?: string;
  createdByAvatar?: string;
  proofImageUrl?: string;
  proofCaption?: string;
  completedDate?: string;
  completedBy?: string;
}

// Daily: Dual-Snap & Mood
export interface DualSnap {
  id: string;
  authorName: string;
  authorId: string;
  avatarUri: string;
  primaryUri: string; // main camera
  secondaryUri: string; // selfie camera
  caption: string;
  timestamp: string;
  dateStr: string;
  location?: string;
  reactions: { emoji: string; count: number; byMe?: boolean }[];
}

export type MoodStage = 'radiant' | 'chill' | 'busy' | 'low' | 'tired';

export interface DailyMoodEntry {
  date: string; // YYYY-MM-DD
  userMood: MoodStage | null;
  userNote?: string;
  partnerMood: MoodStage | null;
  partnerNote?: string;
}
