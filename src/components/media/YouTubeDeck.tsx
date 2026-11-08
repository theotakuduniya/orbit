/**
 * YouTubeDeck: Synced watchdeck room for couples and close groups
 * Features synchronized video queue, together-at timestamps, and video playback
 */
import React, { useState } from 'react';
import { VideoItem } from '../../types/orbit';
import { INITIAL_VIDEOS, CURRENT_USER } from '../../utils/mockData';
import { Play, Plus, Tv, Users, X, Check, Radio } from 'lucide-react';
import { haptics } from '../../utils/haptics';

export const YouTubeDeck: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [activeVideo, setActiveVideo] = useState<VideoItem>(INITIAL_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('');

  const handleSelectVideo = (video: VideoItem) => {
    haptics.selection();
    setActiveVideo(video);
    setIsPlaying(true);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    haptics.success();
    const newVid: VideoItem = {
      id: `vid_${Date.now()}`,
      title: newTitle.trim(),
      channel: newChannel.trim() || 'Shared Channel',
      thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      duration: '15:20',
      addedBy: CURRENT_USER,
      progressPercent: 0,
      togetherAt: '00:00',
      youtubeId: 'custom',
    };

    setVideos((prev) => [newVid, ...prev]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewChannel('');
  };

  return (
    <div className="flex flex-col h-full pb-16 max-w-6xl mx-auto w-full">
      <div className="lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* Featured Video Player Viewport */}
        <div className="lg:col-span-7 p-3">
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video shadow-lg border border-black/[0.08] dark:border-white/[0.1]">
            <img
              src={activeVideo.thumbnailUrl}
              alt={activeVideo.title}
              className="w-full h-full object-cover opacity-80"
            />

            {/* Sync Header Overlay */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                <span>SYNCED ROOM · {activeVideo.togetherAt}</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-300" />
                <span>Alex & Sam watching</span>
              </span>
            </div>

            {/* Center Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => {
                  haptics.light();
                  setIsPlaying(!isPlaying);
                }}
                className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl backdrop-blur-xs active:scale-95 transition-transform"
              >
                <Play className="w-6 h-6 fill-current ml-1" />
              </button>
            </div>

            {/* Bottom Progress Scrub Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${activeVideo.progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-white/90 font-medium">
                <span className="truncate pr-2">{activeVideo.title}</span>
                <span className="font-mono tabular-nums shrink-0">{activeVideo.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Watch Room Queue */}
        <div className="lg:col-span-5 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Tv className="w-4 h-4 text-red-500" />
              Watch Party Queue ({videos.length})
            </span>
            <button
              onClick={() => {
                haptics.light();
                setIsAddOpen(true);
              }}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#6750A4] dark:bg-[#D0BCFF] text-white dark:text-[#381E72]"
            >
              <Plus className="w-3 h-3" />
              <span>Queue Video</span>
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[480px]">
        {videos.map((vid) => {
          const isActive = vid.id === activeVideo.id;
          return (
            <div
              key={vid.id}
              onClick={() => handleSelectVideo(vid)}
              className={`flex items-center gap-3 p-2 rounded-2xl cursor-pointer border transition-all active:scale-[0.99] ${
                isActive
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 shadow-xs'
                  : 'bg-white dark:bg-[#1D1B20] border-black/[0.06] dark:border-white/[0.08] hover:bg-black/[0.02]'
              }`}
            >
              <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-black/10">
                <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 rounded">
                  {vid.duration}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {vid.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{vid.channel}</p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                  <img
                    src={vid.addedBy.avatar}
                    alt={vid.addedBy.name}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  <span>Added by {vid.addedBy.name}</span>
                </div>
              </div>

              {isActive && (
                <span className="text-[10px] font-semibold text-red-500 shrink-0 px-2">
                  Watching
                </span>
              )}
            </div>
          );
        })}
          </div>
        </div>
      </div>

      {/* Add Video Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setIsAddOpen(false)} />
          <div className="relative w-full max-w-xs p-5 rounded-3xl bg-[#FEF7FF] dark:bg-[#211F26] shadow-2xl border border-black/[0.08] dark:border-white/[0.1] z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-red-500" />
                Add video
              </span>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddVideo} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Video title or topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tiny Desk Concert"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Channel name
                </label>
                <input
                  type="text"
                  placeholder="e.g. NPR Music"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6750A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-xl shadow-xs"
                >
                  Queue Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
