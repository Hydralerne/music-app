import { useState, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useAudioPlayback = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Timer for updating position
  const positionTimer = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionTimer.current) {
        clearInterval(positionTimer.current);
      }
    };
  }, [sound]);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      
      if (status.didJustFinish) {
        clearInterval(positionTimer.current);
      }
    }
  };

  const loadAudio = async (audioUrl) => {
    try {
      setLoading(true);
      setError(null);
      setPosition(0);
      setDuration(0);
      
      // Unload previous sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
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
      console.error('Error loading audio:', err);
      setError('Failed to load audio');
      setLoading(false);
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
    position,
    duration,
    loading,
    error,
    togglePlayback,
    seekTo,
    loadAudio
  };
}; 