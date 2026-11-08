/**
 * Initial curated data for Orbit Mobile
 * Provides couple & close-group spaces with rich initial content
 */
import {
  Space,
  SpaceMember,
  MoodboardItem,
  TierRow,
  TierItem,
  MemeItem,
  TrackItem,
  VideoItem,
  VaultItem,
  WatchlistItem,
  BucketListItem,
  DualSnap,
  DailyMoodEntry,
  MoodStage,
  GalleryItem
} from '../types/orbit';

export const CURRENT_USER: SpaceMember = {
  id: 'user_alex',
  name: 'Alex',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  color: '#8B5CF6',
  status: 'In class until 4pm 📚',
  isOnline: true,
  currentActivity: 'Listening to Sabrina Carpenter',
  lastActive: 'Just now',
};

export const PARTNER: SpaceMember = {
  id: 'user_sam',
  name: 'Sam 💖',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  color: '#EC4899',
  status: 'Coffee run ☕',
  isOnline: true,
  currentActivity: 'Cooking pasta bolognese',
  lastActive: '2m ago',
};

export const THIRD_MEMBER: SpaceMember = {
  id: 'user_jordan',
  name: 'Jordan',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  color: '#10B981',
  status: 'Gym mode 🏋️',
  isOnline: false,
  currentActivity: 'Offline',
  lastActive: '1h ago',
};

export const INITIAL_SPACES: Space[] = [
  {
    id: 'space_us',
    name: 'Us 💖',
    emoji: '💖',
    description: 'Our private universe for 2',
    members: [CURRENT_USER, PARTNER],
    anniversaryOrDate: '842 days together',
  },
  {
    id: 'space_trio',
    name: 'The Trio ☕',
    emoji: '☕',
    description: 'Coffee, memes & weekend trips',
    members: [CURRENT_USER, PARTNER, THIRD_MEMBER],
  },
  {
    id: 'space_tokyo',
    name: 'Tokyo 2026 ⛩️',
    emoji: '⛩️',
    description: 'Trip planning & food wishlist',
    members: [CURRENT_USER, PARTNER],
  },
];

export const INITIAL_MOODBOARD_ITEMS: MoodboardItem[] = [
  {
    id: 'mb_1',
    type: 'photo',
    title: 'Kyoto Bamboo Grove',
    content: 'Must rent bikes early morning before crowds!',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
    color: '#FBCFE8', // Soft pastel pink card
    authorId: 'user_sam',
    rotation: -2,
    position: { x: 20, y: 30 },
    likes: 4,
    timestamp: 'Yesterday',
  },
  {
    id: 'mb_2',
    type: 'note',
    title: 'Reminder 💌',
    content: 'Pack that warm jacket for the rooftop sunset date on Saturday!',
    color: '#FEF08A', // Sunny pastel yellow
    authorId: 'user_alex',
    rotation: 2.5,
    position: { x: 190, y: 70 },
    likes: 2,
    timestamp: '2h ago',
  },
  {
    id: 'mb_3',
    type: 'photo',
    title: 'Matcha Latte Art',
    content: 'Found this aesthetic cafe in Daikanyama 🍵',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    color: '#BBF7D0', // Pastel mint
    authorId: 'user_alex',
    rotation: -1.5,
    position: { x: 30, y: 320 },
    likes: 5,
    timestamp: '3h ago',
  },
  {
    id: 'mb_4',
    type: 'note',
    title: 'Movie Night Cue 🍿',
    content: 'Our turn to re-watch Studio Ghibli films with homemade caramel popcorn!',
    color: '#E9D5FF', // Pastel lavender
    authorId: 'user_sam',
    rotation: -2.8,
    position: { x: 140, y: 220 },
    likes: 7,
    timestamp: 'Yesterday',
  },
  {
    id: 'mb_5',
    type: 'note',
    title: 'Little Gratitude 🌿',
    content: 'Thank you for making iced matcha every single morning before my morning class ❤️',
    color: '#BAE6FD', // Pastel sky blue
    authorId: 'user_alex',
    rotation: 1.6,
    position: { x: 280, y: 150 },
    likes: 9,
    timestamp: '3 days ago',
  },
  {
    id: 'mb_6',
    type: 'photo',
    title: 'Tiny House Cabin Airbnb',
    content: 'Upstate forest cabin with cedar hot tub booked for late fall anniversary weekend!',
    imageUrl: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=600&q=80',
    color: '#FED7AA', // Pastel peach
    authorId: 'user_sam',
    rotation: 1.8,
    position: { x: 190, y: 360 },
    likes: 6,
    timestamp: '2 days ago',
  },
];

export const INITIAL_TIER_STASH: TierItem[] = [
  {
    id: 't_sourdough',
    title: 'Tartine Sourdough',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    category: 'Bakery',
  },
  {
    id: 't_boba',
    title: 'Brown Sugar Milk Tea',
    imageUrl: 'https://images.unsplash.com/photo-1558857563-b37cfb2a2656?auto=format&fit=crop&w=300&q=80',
    category: 'Drinks',
  },
  {
    id: 't_ramen',
    title: 'Tonkotsu Ramen',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
    category: 'Dinner',
  },
  {
    id: 't_tacos',
    title: 'Al Pastor Tacos',
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80',
    category: 'Street Food',
  },
  {
    id: 't_crepe',
    title: 'Strawberry Crepe',
    imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=300&q=80',
    category: 'Dessert',
  },
];

export const INITIAL_TIER_ROWS: TierRow[] = [
  {
    key: 'S',
    label: 'S',
    color: '#FF7F7F',
    items: [
      {
        id: 't_croissant',
        title: 'Almond Croissant',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 't_pizza',
        title: 'Woodfired Pizza',
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    key: 'A',
    label: 'A',
    color: '#FFBF7F',
    items: [
      {
        id: 't_acai',
        title: 'Açai Smoothie Bowl',
        imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    key: 'B',
    label: 'B',
    color: '#FFDF7F',
    items: [
      {
        id: 't_bagel',
        title: 'Everything Bagel',
        imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=300&q=80',
      },
    ],
  },
  {
    key: 'C',
    label: 'C',
    color: '#FFFF7F',
    items: [],
  },
  {
    key: 'D',
    label: 'D',
    color: '#BFFF7F',
    items: [],
  },
];

export const INITIAL_TIER_COLLECTIONS: import('../types/orbit').TierListCollection[] = [
  {
    id: 'tierlist_foods',
    title: 'Couple Comfort Foods 🍕',
    emoji: '🍕',
    category: 'Food & Dining',
    tiers: INITIAL_TIER_ROWS,
    stash: INITIAL_TIER_STASH,
    updatedAt: 'Today',
  },
  {
    id: 'tierlist_dates',
    title: 'Weekend Date Night Ideas 🎡',
    emoji: '🎡',
    category: 'Couple Activities',
    tiers: [
      {
        key: 'S',
        label: 'S',
        color: '#FF7F7F',
        items: [
          {
            id: 'd_blanket',
            title: 'Blanket Fort Movie Night',
            imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
          },
          {
            id: 'd_sunset',
            title: 'Sunset Beach Picnic',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        key: 'A',
        label: 'A',
        color: '#FFBF7F',
        items: [
          {
            id: 'd_pottery',
            title: 'Pottery Wheel Class',
            imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        key: 'B',
        label: 'B',
        color: '#FFDF7F',
        items: [
          {
            id: 'd_arcade',
            title: 'Retro Arcade Bar',
            imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        key: 'C',
        label: 'C',
        color: '#FFFF7F',
        items: [],
      },
      {
        key: 'D',
        label: 'D',
        color: '#BFFF7F',
        items: [],
      },
    ],
    stash: [
      {
        id: 'd_museum',
        title: 'Modern Art Museum',
        imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'd_cooking',
        title: 'Pasta Making at Home',
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'd_escape',
        title: 'Escape Room Puzzle',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80',
      },
    ],
    updatedAt: '2 days ago',
  },
  {
    id: 'tierlist_movies',
    title: 'Studio Ghibli & Anime Films 🎬',
    emoji: '🎬',
    category: 'Entertainment',
    tiers: [
      {
        key: 'S',
        label: 'S',
        color: '#FF7F7F',
        items: [
          {
            id: 'm_spirited',
            title: 'Spirited Away',
            imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        key: 'A',
        label: 'A',
        color: '#FFBF7F',
        items: [
          {
            id: 'm_howl',
            title: 'Howl’s Moving Castle',
            imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80',
          },
        ],
      },
      {
        key: 'B',
        label: 'B',
        color: '#FFDF7F',
        items: [],
      },
      {
        key: 'C',
        label: 'C',
        color: '#FFFF7F',
        items: [],
      },
      {
        key: 'D',
        label: 'D',
        color: '#BFFF7F',
        items: [],
      },
    ],
    stash: [
      {
        id: 'm_mononoke',
        title: 'Princess Mononoke',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'm_totoro',
        title: 'My Neighbor Totoro',
        imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80',
      },
      {
        id: 'm_kiki',
        title: 'Kiki’s Delivery Service',
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      },
    ],
    updatedAt: 'Oct 28',
  },
];

export const INITIAL_MEMES: MemeItem[] = [
  {
    id: 'meme_1',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    caption: 'Literally us when the waiter brings our garlic bread',
    authorId: 'user_sam',
    authorName: 'Sam',
    authorAvatar: PARTNER.avatar,
    likes: 12,
    fires: 8,
    userLiked: true,
    userFired: false,
    timestamp: '1h ago',
    voiceReactions: [
      {
        id: 'vr_1',
        authorId: 'user_alex',
        authorName: 'Alex',
        authorAvatar: CURRENT_USER.avatar,
        durationSec: 4.2,
        timestamp: '45m ago',
        waveform: [0.3, 0.6, 0.9, 0.4, 0.7, 0.9, 0.5, 0.2, 0.8, 0.4, 0.6],
      },
    ],
  },
  {
    id: 'meme_2',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    caption: 'When you say "I am not hungry" and then eat half my fries',
    authorId: 'user_alex',
    authorName: 'Alex',
    authorAvatar: CURRENT_USER.avatar,
    likes: 19,
    fires: 14,
    userLiked: true,
    userFired: true,
    timestamp: '4h ago',
    voiceReactions: [
      {
        id: 'vr_2',
        authorId: 'user_sam',
        authorName: 'Sam',
        authorAvatar: PARTNER.avatar,
        durationSec: 3.5,
        timestamp: '3h ago',
        waveform: [0.2, 0.5, 0.7, 0.9, 0.6, 0.3, 0.4, 0.7, 0.3],
      },
    ],
  },
  {
    id: 'meme_3',
    imageUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
    caption: 'Me pretending to listen while internally planning our next vacation',
    authorId: 'user_sam',
    authorName: 'Sam',
    authorAvatar: PARTNER.avatar,
    likes: 8,
    fires: 5,
    userLiked: false,
    userFired: false,
    timestamp: 'Yesterday',
    voiceReactions: [],
  },
  {
    id: 'meme_4',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
    caption: 'Our cat judging us watching 6 episodes in a row on Sunday',
    authorId: 'user_alex',
    authorName: 'Alex',
    authorAvatar: CURRENT_USER.avatar,
    likes: 15,
    fires: 9,
    userLiked: false,
    userFired: true,
    timestamp: '2 days ago',
    voiceReactions: [],
  },
];

export const INITIAL_TRACKS: TrackItem[] = [
  {
    id: 'trk_1',
    title: 'Espresso',
    artist: 'Sabrina Carpenter',
    album: 'Short n’ Sweet',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
    durationMs: 175000,
    addedBy: PARTNER,
    addedAt: 'Today, 11:20 AM',
    syncedWithPartner: true,
  },
  {
    id: 'trk_2',
    title: 'Birds of a Feather',
    artist: 'Billie Eilish',
    album: 'HIT ME HARD AND SOFT',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    durationMs: 196000,
    addedBy: CURRENT_USER,
    addedAt: 'Yesterday',
    syncedWithPartner: true,
  },
  {
    id: 'trk_3',
    title: 'Good Luck, Babe!',
    artist: 'Chappell Roan',
    album: 'Single',
    coverUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=300&q=80',
    durationMs: 218000,
    addedBy: PARTNER,
    addedAt: '3 days ago',
  },
  {
    id: 'trk_4',
    title: 'Not Like Us',
    artist: 'Kendrick Lamar',
    album: 'Single',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    durationMs: 274000,
    addedBy: CURRENT_USER,
    addedAt: '4 days ago',
  },
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid_1',
    title: 'Studio Ghibli Jazz Piano Relaxation (3 Hours)',
    channel: 'Cafe Music BGM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=600&q=80',
    duration: '3:04:15',
    addedBy: PARTNER,
    progressPercent: 42,
    togetherAt: '01:18:30',
    youtubeId: 'Dx5qFachd3A',
  },
  {
    id: 'vid_2',
    title: 'Tokyo Street Food Tour: Tsukiji Outer Market at 6 AM',
    channel: 'Strictly Dumpling',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    duration: '24:18',
    addedBy: CURRENT_USER,
    progressPercent: 100,
    togetherAt: 'Finished',
    youtubeId: 'sample_yt_2',
  },
  {
    id: 'vid_3',
    title: 'The Secret Architecture of European Cobblestone Towns',
    channel: 'The Local Project',
    thumbnailUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80',
    duration: '18:42',
    addedBy: PARTNER,
    progressPercent: 12,
    togetherAt: '02:14',
    youtubeId: 'sample_yt_3',
  },
];

export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'v_1',
    title: 'Osteria Mozza Pasta Tasting',
    caption: 'Anniversary dinner reservation booked for table 4 at 7:30 PM with candlelit patio.',
    url: 'https://osteriamozza.com',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    category: 'restaurant',
    completed: false,
    addedBy: PARTNER,
    addedAt: '2 days ago',
    tags: ['Dinner', 'Anniversary', 'Italian'],
  },
  {
    id: 'v_2',
    title: 'Pottery Wheel Throwing Workshop',
    caption: '2-hour beginner clay throwing class in Silver Lake. Includes firing 2 mugs!',
    url: 'https://potterystudio.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    category: 'idea',
    completed: true,
    addedBy: CURRENT_USER,
    addedAt: 'Last week',
    tags: ['Creative', 'Date Night', 'Done'],
  },
  {
    id: 'v_3',
    title: 'Crispy Lemon Ricotta Pancakes',
    caption: 'Secret Sunday breakfast recipe with whipped mascarpone and blueberry compote.',
    url: 'https://cooking.nytimes.com',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80',
    category: 'recipe',
    completed: false,
    addedBy: PARTNER,
    addedAt: 'Yesterday',
    tags: ['Brunch', 'Sweet'],
  },
  {
    id: 'v_4',
    title: 'Big Sur Highway 1 Scenic Roadtrip Itinerary',
    caption: 'Bixby Bridge photo stop, McWay Falls, Nepenthe lunch, and redwoods camping.',
    url: 'https://visitcalifornia.com/big-sur',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    category: 'travel',
    completed: false,
    addedBy: CURRENT_USER,
    addedAt: 'Oct 14',
    tags: ['Roadtrip', 'Coast'],
  },
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal_1',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=80',
    title: 'Golden hour walk at Sunset Cliffs 🌅',
    type: 'shared',
    authorId: 'user_alex',
    authorName: 'Alex',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timestamp: 'Yesterday',
    likes: 8,
    userLiked: true,
  },
  {
    id: 'gal_2',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    title: 'Sam laughing mid-bite at brunch 🥞',
    type: 'sam',
    authorId: 'user_sam',
    authorName: 'Sam',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    timestamp: '2 days ago',
    likes: 12,
    userLiked: true,
  },
  {
    id: 'gal_3',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80',
    title: 'Pacific Coast Highway pitstop 🌊',
    type: 'shared',
    authorId: 'user_alex',
    authorName: 'Alex',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timestamp: 'Last weekend',
    likes: 15,
    userLiked: false,
  },
  {
    id: 'gal_4',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80',
    title: 'Alex looking cool at the record store 🎧',
    type: 'alex',
    authorId: 'user_alex',
    authorName: 'Alex',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    timestamp: 'Oct 28',
    likes: 9,
    userLiked: true,
  },
  {
    id: 'gal_5',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
    title: 'Fresh sourdough loaf baked this morning 🍞',
    type: 'shared',
    authorId: 'user_sam',
    authorName: 'Sam',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    timestamp: 'Oct 25',
    likes: 6,
    userLiked: false,
  },
];

export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    id: 'mov_1',
    title: 'Past Lives',
    year: 2023,
    genre: 'Romance / Drama',
    rating: 8.9,
    type: 'movie',
    status: 'watched',
    watchedBy: ['alex', 'sam'],
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    overview: 'Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora’s family emigrates from South Korea.',
    runtime: '1h 45m',
    swipedByMe: 'liked',
    swipedByPartner: 'liked',
    isMatch: true,
    reactions: [
      { userId: 'user_sam', userName: 'Sam', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', text: 'Cried so much at the ending! 10/10 😭❤️', emoji: '😭' },
      { userId: 'user_alex', userName: 'Alex', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', text: 'One of the best movies we watched together.', emoji: '✨' },
    ],
  },
  {
    id: 'mov_2',
    title: 'Spirited Away',
    year: 2001,
    genre: 'Animation / Fantasy',
    rating: 9.3,
    type: 'anime',
    status: 'watched',
    watchedBy: ['alex'],
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    overview: 'During her family’s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    runtime: '2h 05m',
    swipedByMe: 'liked',
    swipedByPartner: 'liked',
    isMatch: true,
    reactions: [
      { userId: 'user_sam', userName: 'Sam', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', text: 'I will watch this next with you! 🙋‍♀️🍿', emoji: '🙋‍♀️' },
    ],
  },
  {
    id: 'mov_3',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    genre: 'Sci-Fi / Adventure',
    rating: 8.8,
    type: 'movie',
    status: 'want_to_watch',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    overview: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.',
    runtime: '2h 19m',
    swipedByMe: 'liked',
    swipedByPartner: 'liked',
    isMatch: true,
    reactions: [
      { userId: 'user_alex', userName: 'Alex', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', text: 'Queueing this up for Friday night! 🥯', emoji: '🍿' },
    ],
  },
  {
    id: 'mov_4',
    title: 'Arcane: League of Legends',
    year: 2021,
    genre: 'Animation / Sci-Fi',
    rating: 9.0,
    type: 'show',
    status: 'watching',
    watchedBy: ['sam'],
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    overview: 'Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions.',
    runtime: '9 eps',
    swipedByMe: undefined,
    swipedByPartner: 'liked',
    isMatch: false,
    reactions: [
      { userId: 'user_alex', userName: 'Alex', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', text: 'I will watch this next! Don’t finish without me 👀', emoji: '🙋‍♂️' },
    ],
  },
  {
    id: 'mov_5',
    title: 'Frieren: Beyond Journey’s End',
    year: 2023,
    genre: 'Anime / Fantasy',
    rating: 9.1,
    type: 'anime',
    status: 'want_to_watch',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    overview: 'An elf mage and her companions defeat the Demon King. As her human comrades pass away from old age, she sets out to understand mortality.',
    runtime: '28 eps',
    swipedByMe: undefined,
    swipedByPartner: 'liked',
    isMatch: false,
    reactions: [
      { userId: 'user_sam', userName: 'Sam', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80', text: 'Heard the animation and soundtrack is legendary 🌸', emoji: '✨' },
    ],
  },
  {
    id: 'mov_6',
    title: 'La La Land',
    year: 2016,
    genre: 'Musical / Romance',
    rating: 8.7,
    type: 'movie',
    status: 'watched',
    watchedBy: ['alex', 'sam'],
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    overview: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.',
    runtime: '2h 08m',
    swipedByMe: 'liked',
    swipedByPartner: 'liked',
    isMatch: true,
    reactions: [
      { userId: 'user_alex', userName: 'Alex', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', text: 'City of stars on piano forever in our head 🎶', emoji: '🎹' },
    ],
  },
];

export const INITIAL_BUCKET_LIST: BucketListItem[] = [
  {
    id: 'b_1',
    title: 'See the Northern Lights in Tromsø',
    category: 'Travel',
    targetDate: 'Winter 2027',
    completed: false,
    createdById: 'user_alex',
    createdByName: 'Alex',
    createdByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'b_2',
    title: 'Run a 10K together in matching outfits',
    category: 'Milestone',
    targetDate: 'May 2026',
    completed: true,
    createdById: 'user_alex',
    createdByName: 'Alex',
    createdByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    proofImageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=600&q=80',
    proofCaption: 'Crossed the finish line holding hands in 56 minutes! 🏅✨',
    completedDate: 'Nov 2025',
    completedBy: 'Alex & Sam',
  },
  {
    id: 'b_3',
    title: 'Learn to make handmade pasta from scratch',
    category: 'Food',
    targetDate: 'Spring 2026',
    completed: true,
    createdById: 'user_sam',
    createdByName: 'Sam',
    createdByAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    proofImageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    proofCaption: 'Tagliatelle with truffle butter! Total flour explosion in kitchen haha',
    completedDate: 'Sep 2025',
    completedBy: 'Alex & Sam',
  },
  {
    id: 'b_4',
    title: 'Hot air balloon flight over Cappadocia',
    category: 'Adventure',
    targetDate: 'Autumn 2027',
    completed: false,
    createdById: 'user_sam',
    createdByName: 'Sam',
    createdByAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'b_5',
    title: 'Build a giant cozy blanket fort with fairy lights',
    category: 'Milestone',
    targetDate: 'Rainy Sunday',
    completed: true,
    createdById: 'user_sam',
    createdByName: 'Sam',
    createdByAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    proofImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    proofCaption: 'Movie marathon inside our fortress with hot cocoa ☕',
    completedDate: 'Dec 2025',
    completedBy: 'Sam',
  },
  {
    id: 'b_6',
    title: 'Camp under the stars in Joshua Tree',
    category: 'Adventure',
    targetDate: 'Spring 2027',
    completed: false,
    createdById: 'user_alex',
    createdByName: 'Alex',
    createdByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];

export const INITIAL_DUAL_SNAPS: DualSnap[] = [
  {
    id: 'snap_today',
    authorName: 'Sam 💖',
    authorId: 'user_sam',
    avatarUri: PARTNER.avatar,
    // rear camera: beautiful cozy cafe table
    primaryUri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    // front camera: smiling selfie
    secondaryUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    caption: 'Waiting for Alex at our favorite sunny window corner ☕✨',
    timestamp: '14 minutes ago',
    dateStr: 'Today, 3:21 PM',
    location: 'Verwöhnt Coffee Roasters',
    reactions: [
      { emoji: '💖', count: 3, byMe: true },
      { emoji: '☕', count: 2, byMe: true },
      { emoji: '✨', count: 4, byMe: false },
    ],
  },
  {
    id: 'snap_yesterday',
    authorName: 'Alex',
    authorId: 'user_alex',
    avatarUri: CURRENT_USER.avatar,
    // rear camera: park dog playing
    primaryUri: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    // front camera: laughing selfie
    secondaryUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    caption: 'Golden hour walk in the park! Met 4 golden retrievers 🐕',
    timestamp: 'Yesterday at 5:48 PM',
    dateStr: 'Yesterday',
    location: 'Echo Park Lake',
    reactions: [
      { emoji: '🥺', count: 5, byMe: false },
      { emoji: '💖', count: 3, byMe: true },
    ],
  },
];

// 30 days paired mood history
export const INITIAL_MOOD_HISTORY: DailyMoodEntry[] = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const dateStr = d.toISOString().split('T')[0];

  const moods: MoodStage[] = ['radiant', 'chill', 'busy', 'low', 'tired'];
  const userMood = i === 29 ? 'radiant' : moods[(i * 3 + 1) % moods.length];
  const partnerMood = i === 29 ? 'chill' : moods[(i * 2 + 4) % moods.length];

  return {
    date: dateStr,
    userMood,
    userNote: i === 29 ? 'Productive coding session, feeling super accomplished!' : undefined,
    partnerMood,
    partnerNote: i === 29 ? 'Peaceful afternoon with good music and warm tea' : undefined,
  };
});
