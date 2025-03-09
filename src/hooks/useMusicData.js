import { useState, useEffect } from 'react';
import { getHome, youtubeMusicSearch } from '@hydralerne/youtube-api';

const FALLBACK_CATEGORIES = [
  { name: 'Top Hits', query: 'top hits 2023' },
  { name: 'Popular', query: 'popular songs' },
  { name: 'Trending', query: 'trending music' }
];

export default function useMusicData() {
  const [musicData, setMusicData] = useState({
    picks: [],
    albums: [],
    singles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
} 