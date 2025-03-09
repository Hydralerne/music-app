import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MiniPlayer = ({ 
  track, 
  thumbnailUrl, 
  artistName, 
  isPlaying, 
  position, 
  duration, 
  loading, 
  onPress, 
  onTogglePlayback,
  dominantColor = '#B19CD9' // Default color if none provided
}) => {
  // Calculate progress percentage
  const progress = duration > 0 ? (position / duration) * 100 : 0;
  
  // Generate gradient colors based on dominant color
  const primaryColor = dominantColor;
  const secondaryColor = adjustColorBrightness(dominantColor, -30); // Darker variant
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.background}
      />
      
      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: thumbnailUrl || 'https://via.placeholder.com/60' }} 
          style={styles.thumbnail}
        />
      </View>
      
      {/* Track info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {track?.title || 'Unknown Title'}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artistName || 'Unknown Artist'}
        </Text>
      </View>
      
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={onTogglePlayback}
          disabled={loading}
        >
          {loading ? (
            <Animated.View style={styles.loadingIndicator}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </Animated.View>
          ) : (
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={24} 
              color="#fff" 
            />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Helper function to adjust color brightness
const adjustColorBrightness = (hex, percent) => {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Adjust brightness
  r = Math.max(0, Math.min(255, r + percent));
  g = Math.max(0, Math.min(255, g + percent));
  b = Math.max(0, Math.min(255, b + percent));

  // Convert back to hex
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  thumbnailContainer: {
    marginLeft: 8,
    marginRight: 12,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  artist: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MiniPlayer; 