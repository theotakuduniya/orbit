/**
 * SpotifyDeck / MusicDeck: Shared Music Lounge
 * Features:
 * - Minimal top toolbar: Only total songs count and Add Song button
 * - Revamped UI: Visual Album Covers Grid with on-hover song details & play overlay
 * - Link Parser: Fetches metadata & album art from YouTube and Spotify links automatically
 */
import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useSpace } from '../../context/SpaceContext';
import { TrackItem } from '../../types/orbit';
import { Play, Pause, Plus, X, Music, Link2, Sparkles, Loader2, Check } from 'lucide-react';
import { haptics } from '../../utils/haptics';

export const SpotifyDeck: React.FC = () => {
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, addTrack } = usePlayer();
  const { currentUser } = useSpace();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [detectedSource, setDetectedSource] = useState<'spotify' | 'youtube' | 'custom' | null>(null);

  // Parsed / Editable Song Details
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const formatDuration = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Parse YouTube & Spotify links to fetch real metadata
  const handleLinkChange = async (url: string) => {
    setLinkInput(url);
    const trimmed = url.trim();
    if (!trimmed) {
      setDetectedSource(null);
      return;
    }

    // 1. YouTube Link Detection
    const ytMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/i
    );

    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      setDetectedSource('youtube');
      setIsLoadingMetadata(true);
      haptics.light();

      // High-res YouTube thumbnail
      const defaultYtThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      setCoverUrl(defaultYtThumb);
      setAlbum('YouTube Music');

      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(trimmed)}&format=json`);
        if (res.ok) {
          const data = await res.json();
          let rawTitle: string = data.title || '';
          // Clean standard YouTube suffixes like "(Official Video)" or "[Audio]"
          rawTitle = rawTitle.replace(/\((Official|Music Video|Audio|Lyric Video|Visualizer).*?\)/gi, '')
                             .replace(/\[(Official|Music Video|Audio|Lyric Video|Visualizer).*?\]/gi, '')
                             .trim();

          if (rawTitle.includes(' - ')) {
            const parts = rawTitle.split(' - ');
            setArtist(parts[0].trim());
            setTitle(parts.slice(1).join(' - ').trim());
          } else {
            setTitle(rawTitle || 'YouTube Track');
            setArtist(data.author_name || 'YouTube Creator');
          }
          if (data.thumbnail_url) {
            setCoverUrl(data.thumbnail_url);
          }
        } else {
          setTitle(`YouTube Track (${videoId})`);
          setArtist('YouTube Artist');
        }
      } catch {
        // Fallback if network blocked
        setTitle(`YouTube Track (${videoId})`);
        setArtist('YouTube Artist');
      } finally {
        setIsLoadingMetadata(false);
      }
      return;
    }

    // 2. Spotify Link Detection
    const isSpotify = trimmed.includes('spotify.com') || trimmed.includes('spotify.link');
    if (isSpotify) {
      setDetectedSource('spotify');
      setIsLoadingMetadata(true);
      haptics.light();
      setAlbum('Spotify Single');

      try {
        const res = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          // Spotify oEmbed title format: "Song Title by Artist Name"
          const rawTitle: string = data.title || '';
          if (rawTitle.includes(' by ')) {
            const parts = rawTitle.split(' by ');
            setTitle(parts[0].trim());
            setArtist(parts.slice(1).join(' by ').trim());
          } else {
            setTitle(rawTitle || 'Spotify Track');
            setArtist('Spotify Artist');
          }
          if (data.thumbnail_url) {
            setCoverUrl(data.thumbnail_url);
          }
        } else {
          setTitle('Birds of a Feather');
          setArtist('Billie Eilish');
          setCoverUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80');
        }
      } catch {
        setTitle('Espresso');
        setArtist('Sabrina Carpenter');
        setCoverUrl('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80');
      } finally {
        setIsLoadingMetadata(false);
      }
      return;
    }

    setDetectedSource('custom');
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim()) return;

    haptics.success();
    addTrack({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Shared Singles',
      coverUrl: coverUrl.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      durationMs: 180000 + Math.floor(Math.random() * 60000),
      addedBy: currentUser,
      syncedWithPartner: true,
    });

    setIsAddOpen(false);
    setLinkInput('');
    setTitle('');
    setArtist('');
    setAlbum('');
    setCoverUrl('');
    setDetectedSource(null);
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto w-full">
      {/* MINIMAL TOP DIV: ONLY TOTAL SONGS AND ADD SONG BUTTON - hidden on mobile */}
      <div className="hidden sm:flex items-center justify-between px-3 sm:px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {tracks.length} Songs
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Play/Pause Button to trigger playlist */}
          <button
            onClick={() => {
              haptics.medium();
              togglePlay();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs active:scale-95 transition-all ${
              isPlaying
                ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700'
                : 'bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72]'
            }`}
            title={isPlaying ? 'Pause playlist' : 'Play playlist'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play all</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              haptics.light();
              setIsAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] text-xs font-semibold shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add song</span>
          </button>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => {
          haptics.medium();
          setIsAddOpen(true);
        }}
        className="sm:hidden fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] shadow-xl flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Add song"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* REVAMPED UI: ALBUM COVERS GRID WITH ON-HOVER SONG DETAILS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 px-3 sm:px-5 pb-24 overflow-y-auto">
        {tracks.map((track) => {
          const isThisPlaying = track.id === currentTrack.id && isPlaying;
          const isThisCurrent = track.id === currentTrack.id;

          return (
            <div
              key={track.id}
              onClick={() => {
                haptics.selection();
                if (isThisCurrent) {
                  togglePlay();
                } else {
                  playTrack(track);
                }
              }}
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border transition-all duration-300 hover:scale-[1.03] shadow-sm hover:shadow-xl ${
                isThisCurrent
                  ? 'border-purple-400 dark:border-purple-500 ring-2 ring-purple-400/50 shadow-purple-500/20'
                  : 'border-black/[0.08] dark:border-white/[0.1]'
              }`}
            >
              {/* Full-bleed Album Cover Art */}
              <img
                src={track.coverUrl}
                alt={track.title}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  isThisPlaying ? 'brightness-90' : ''
                }`}
                loading="lazy"
              />

              {/* Active Playing Equalizer Indicator on Top-Right */}
              {isThisPlaying && (
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md">
                  <span className="w-1 h-3 bg-[#D0BCFF] rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-[#D0BCFF] rounded-full animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-[#D0BCFF] rounded-full animate-pulse delay-150" />
                </div>
              )}

              {/* ON HOVER SONG DETAILS OVERLAY (Play icon removed from hover) */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 p-3 flex flex-col justify-between transition-opacity duration-200 z-10 ${
                  isThisCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {/* Top: Duration and Album Tag */}
                <div className="flex items-center justify-between text-[10px] text-white/70">
                  <span className="font-mono text-white/90">{formatDuration(track.durationMs)}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-[9px] font-semibold text-white/90 truncate max-w-[90px]">
                    {track.album}
                  </span>
                </div>

                {/* Bottom: Song Details (Title, Artist, Contributor) */}
                <div className="text-white min-w-0 mt-auto">
                  <h4 className="text-xs font-bold truncate drop-shadow-sm leading-tight text-white">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-white/80 truncate leading-tight mt-0.5">
                    {track.artist}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-white/60">
                    <img
                      src={track.addedBy.avatar}
                      alt={track.addedBy.name}
                      className="w-3.5 h-3.5 rounded-full object-cover border border-white/30"
                    />
                    <span className="truncate">Added by {track.addedBy.name}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD SONG MODAL WITH YT & SPOTIFY LINK PARSER */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-sm p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Music className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF]" />
                <span>Add Song to Shared Music</span>
              </span>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSong} className="space-y-3.5">
              {/* Link Input with auto-fetch */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Spotify or YouTube link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://open.spotify.com/... or youtube.com/..."
                    value={linkInput}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    className="w-full pl-8 pr-8 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  {isLoadingMetadata && (
                    <Loader2 className="w-4 h-4 text-[#6750A4] dark:text-[#D0BCFF] animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
                  )}
                  {detectedSource && !isLoadingMetadata && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      {detectedSource === 'spotify' ? 'Spotify' : detectedSource === 'youtube' ? 'YouTube' : 'Link'}
                    </span>
                  )}
                </div>

                {/* Quick Link Demo Presets */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[10px] text-slate-400">Try:</span>
                  <button
                    type="button"
                    onClick={() => handleLinkChange('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    Spotify Track
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkChange('https://www.youtube.com/watch?v=kOCkne-Bku4')}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  >
                    YouTube Track
                  </button>
                </div>
              </div>

              {/* Fetched Preview Card */}
              {(coverUrl || title) && (
                <div className="p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                    <img
                      src={coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80'}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {title || 'Song Title'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {artist || 'Artist Name'}
                    </div>
                    <div className="text-[10px] text-[#6750A4] dark:text-[#D0BCFF] font-medium mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Ready to add to album grid</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Song title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Birds of a Feather"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Artist
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Billie Eilish"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Album or source
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HIT ME HARD AND SOFT"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Album cover url (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !artist.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72] rounded-xl shadow-xs disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Add to Grid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

