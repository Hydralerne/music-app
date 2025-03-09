import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { getData, filter, getTrackData } from '@hydralerne/youtube-api';

export default function useAudio() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  
  const positionTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionTimer.current) {
        clearInterval(positionTimer.current);
      }
    };
  }, []);

  const loadTrack = async (track) => {
    if (!track || !track.videoId) return;
    
    try {
      setLoading(true);
      setError(null);
      setPosition(0);
      setDuration(0);
      setCurrentTrack(track);
      
      // Get audio stream
      const formats = await getData(track.videoId);
      const audioFormat = filter(formats, 'bestaudio');
      
      if (!audioFormat || !audioFormat.url) {
        throw new Error('No audio format found');
      }
      
      // Unload previous sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioFormat.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setLoading(false);
      
      // Start position timer
      if (positionTimer.current) {
        clearInterval(positionTimer.current);
      }
      
      positionTimer.current = setInterval(async () => {
        if (newSound) {
          const status = await newSound.getStatusAsync();
          if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            
            if (status.didJustFinish) {
              clearInterval(positionTimer.current);
            }
          }
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error loading track:', err);
      setError('Failed to load track');
      setLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      
      if (status.didJustFinish) {
        // Auto play next track or loop
      }
    }
  };

  const togglePlayback = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekTo = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  return {
    sound,
    isPlaying,
    loading,
    error,
    position,
    duration,
    currentTrack,
    loadTrack,
    togglePlayback,
    seekTo
  };
} 