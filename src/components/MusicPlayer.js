import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  PanResponder, 
  StatusBar,
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { getData, getTrackData, getRelatedAndLyrics } from '@hydralerne/youtube-api';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import components
import MiniPlayer from './player/MiniPlayer';
import FullPlayer from './player/FullPlayer';

// Import utils
import { filterAudioFormat } from '../utils/audioUtils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_PLAYER_HEIGHT = 60; // Adjust based on your mini player height
const MINI_PLAYER_MARGIN_BOTTOM = 90; // Increased margin to avoid overlap with tab bar

const MusicPlayer = ({ track, visible }) => {
  // Get safe area insets
  const insets = useSafeAreaInsets();
  
  // Player state
  const [isExpanded, setIsExpanded] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackInfo, setTrackInfo] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [relatedTracks, setRelatedTracks] = useState([]);
  const [dominantColor, setDominantColor] = useState('#121212');
  const [allowFullPlayerInteraction, setAllowFullPlayerInteraction] = useState(false);
  
  // Animation values
  const expandProgress = useRef(new Animated.Value(0)).current;
  
  // Timer for updating position
  const positionTimer = useRef(null);

  // Pan responder for swipe gestures - only for mini player and player header
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only handle vertical swipes
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        expandProgress.stopAnimation();
        setAllowFullPlayerInteraction(false);
      },
      onPanResponderMove: (_, gestureState) => {
        // Calculate the progress based on gesture
        const totalDistance = SCREEN_HEIGHT - MINI_PLAYER_HEIGHT - MINI_PLAYER_MARGIN_BOTTOM;
        let progress;
        
        if (isExpanded) {
          // When expanded, start from 1 and go down
          progress = 1 - (gestureState.dy / totalDistance);
        } else {
          // When collapsed, start from 0 and go up
          progress = -gestureState.dy / totalDistance;
        }
        
        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));
        expandProgress.setValue(progress);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentProgress = expandProgress._value;
        
        // Determine whether to complete or revert the animation
        if (isExpanded) {
          if (currentProgress < 0.5 || gestureState.vy > 0.5) {
            collapsePlayer();
          } else {
            expandPlayer();
          }
        } else {
          if (currentProgress > 0.5 || gestureState.vy < -0.5) {
            expandPlayer();
          } else {
            collapsePlayer();
          }
        }
      }
    })
  ).current;

  useEffect(() => {
    if (track && track.videoId) {
      loadTrack(track.videoId);
    }
    
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionTimer.current) {
        clearInterval(positionTimer.current);
      }
    };
  }, [track]);

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

  const loadTrack = async (videoId) => {
    try {
      setLoading(true);
      setError(null);
      setPosition(0);
      setDuration(0);
      
      // Get track metadata and related content
      const [trackData, relatedData] = await Promise.all([
        getTrackData(videoId),
        getRelatedAndLyrics(videoId)
      ]);
      
      // Store track info
      setTrackInfo(trackData || {});
      
      if (relatedData) {
        // Handle lyrics - check both formats based on your API response
        if (relatedData.lyrics && typeof relatedData.lyrics === 'string') {
          setLyrics(relatedData.lyrics);
        } else if (relatedData.lyrics && relatedData.lyrics.lines) {
          // Format lyrics from lines array to string
          const lyricsText = relatedData.lyrics.lines
            .map(line => line.text)
            .join('\n');
          setLyrics(lyricsText);
        } else {
          setLyrics('No lyrics available');
        }
        
        // Handle related tracks - check both formats based on your API response
        if (Array.isArray(relatedData.related)) {
          setRelatedTracks(relatedData.related);
        } else if (Array.isArray(relatedData.list)) {
          setRelatedTracks(relatedData.list);
        } else {
          setRelatedTracks([]);
        }
      } else {
        setLyrics('No lyrics available');
        setRelatedTracks([]);
      }
      
      // Set a random dominant color (in a real app, extract from image)
      setDominantColor(getRandomColor());
      
      // Get audio stream
      const formats = await getData(videoId);
      const audioFormat = filterAudioFormat(formats);
      
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

  const handleRelatedTrackSelect = (item) => {
    if (item.videoId && item.videoId !== track.videoId) {
      loadTrack(item.videoId);
    }
  };

  const getRandomColor = () => {
    const colors = [
      '#1DB954', // Spotify Green
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#3F51B5', // Indigo
      '#FF9800', // Orange
      '#7B68EE', // Medium Slate Blue
      '#9370DB', // Medium Purple
      '#00CED1', // Dark Turquoise
      '#FF6347', // Tomato
      '#4682B4', // Steel Blue
      '#20B2AA', // Light Sea Green
      '#6A5ACD', // Slate Blue
      '#8A2BE2', // Blue Violet
      '#FF4500', // Orange Red
      '#32CD32', // Lime Green
      '#BA55D3', // Medium Orchid
      '#4169E1', // Royal Blue
      '#FF1493', // Deep Pink
      '#00BFFF', // Deep Sky Blue
      '#FF7F50'  // Coral
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to expand the player with animation
  const expandPlayer = () => {
    Animated.spring(expandProgress, {
      toValue: 1,
      useNativeDriver: false, // We need to animate non-transform properties
      tension: 50,
      friction: 8,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01
    }).start(() => {
      setIsExpanded(true);
      setAllowFullPlayerInteraction(true);
    });
    
    // Change status bar for full player
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }
  };

  // Function to collapse the player with animation
  const collapsePlayer = () => {
    setAllowFullPlayerInteraction(false);
    
    Animated.spring(expandProgress, {
      toValue: 0,
      useNativeDriver: false, // We need to animate non-transform properties
      tension: 50,
      friction: 8,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01
    }).start(() => {
      setIsExpanded(false);
    });
    
    // Restore status bar
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('default', true);
    }
  };

  if (!visible || !track) {
    return null;
  }

  // Get the appropriate thumbnail URL, prioritizing posterLarge
  const thumbnailUrl = trackInfo?.posterLarge || 
                       trackInfo?.poster || 
                       track.posterLarge || 
                       track.poster || 
                       (track.thumbnails && track.thumbnails.length > 0 ? track.thumbnails[0].url : 'https://via.placeholder.com/300');
  
  const artistName = trackInfo?.artist || 
                     track.artist || 
                     (track.artists && track.artists.length > 0 ? track.artists[0].name : 'Unknown Artist');

  // Calculate interpolated values for animations
  
  // Backdrop opacity
  const backdropOpacity = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7]
  });
  
  // Player container animations
  const playerHeight = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [MINI_PLAYER_HEIGHT, SCREEN_HEIGHT]
  });
  
  const playerBottom = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [MINI_PLAYER_MARGIN_BOTTOM, 0]
  });
  
  const playerTop = expandProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT - MINI_PLAYER_HEIGHT - MINI_PLAYER_MARGIN_BOTTOM, 0]
  });
  
  const playerBorderRadius = expandProgress.interpolate({
    inputRange: [0, 0.2],
    outputRange: [12, 0],
    extrapolate: 'clamp'
  });
  
  // Mini player animations
  const miniPlayerOpacity = expandProgress.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  // Full player animations
  const fullPlayerOpacity = expandProgress.interpolate({
    inputRange: [0.7, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Semi-transparent backdrop */}
      <Animated.View 
        style={[styles.backdrop, { opacity: backdropOpacity }]} 
        pointerEvents={isExpanded ? 'auto' : 'none'}
        onTouchStart={collapsePlayer}
      />
      
      {/* Player container */}
      <Animated.View 
        style={[
          styles.playerContainer,
          {
            height: playerHeight,
            top: playerTop,
            marginBottom: playerBottom,
            borderTopLeftRadius: playerBorderRadius,
            borderTopRightRadius: playerBorderRadius,
          }
        ]}
      >
        {/* Mini player with pan responder */}
        <Animated.View 
          style={[
            styles.miniPlayerContainer,
            { opacity: miniPlayerOpacity }
          ]}
          {...panResponder.panHandlers}
        >
          <MiniPlayer
            track={track}
            thumbnailUrl={thumbnailUrl}
            artistName={artistName}
            isPlaying={isPlaying}
            position={position}
            duration={duration}
            loading={loading}
            onPress={expandPlayer}
            onTogglePlayback={togglePlayback}
            dominantColor={dominantColor}
          />
        </Animated.View>
        
        {/* Full player */}
        <Animated.View 
          style={[
            styles.fullPlayerContainer,
            { opacity: fullPlayerOpacity }
          ]}
          pointerEvents={allowFullPlayerInteraction ? 'auto' : 'none'}
        >
          {/* Header with pan responder for swipe down */}
          <View 
            style={styles.headerDragArea}
            {...panResponder.panHandlers}
          />
          
          <FullPlayer
            track={track}
            trackInfo={trackInfo}
            thumbnailUrl={thumbnailUrl}
            artistName={artistName}
            isPlaying={isPlaying}
            position={position}
            duration={duration}
            loading={loading}
            dominantColor={dominantColor}
            lyrics={lyrics}
            relatedTracks={relatedTracks}
            onClose={collapsePlayer}
            onTogglePlayback={togglePlayback}
            onSeek={seekTo}
            onRelatedTrackSelect={handleRelatedTrackSelect}
            allowScroll={allowFullPlayerInteraction}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 9998,
  },
  playerContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 18, 18,1)',
    zIndex: 9999,
    overflow: 'hidden',
  },
  miniPlayerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MINI_PLAYER_HEIGHT,
    zIndex: 10000,
  },
  fullPlayerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  headerDragArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60, // Height of the drag area at the top
    zIndex: 10001,
  }
});

export default MusicPlayer; 