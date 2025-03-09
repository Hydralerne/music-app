import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Sample lyrics to show when no actual lyrics are available
const SAMPLE_LYRICS = [
  "Dancing in the moonlight",
  "Everybody's feeling warm and bright",
  "It's such a fine and natural sight",
  "Everybody's dancing in the moonlight",
  "We like our fun and we never fight"
];

const MiniLyrics = ({ dominantColor, onPress, lyrics }) => {
  // Use dominant color for styling
  const baseColor = dominantColor || '#1DB954';
  
  // State for lyrics preview
  const [lyricsLines, setLyricsLines] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];
  
  // Parse lyrics and extract a preview
  useEffect(() => {
    let lines = [];
    
    if (!lyrics || typeof lyrics !== 'string' || lyrics.trim().length === 0) {
      // Use sample lyrics if no actual lyrics are available
      lines = SAMPLE_LYRICS;
    } else {
      // Split actual lyrics into lines and filter out empty lines
      lines = lyrics
        .split('\n')
        .filter(line => line.trim().length > 0)
        .slice(0, 5); // Get first 5 lines for preview
      
      // If still no valid lyrics, use sample lyrics
      if (lines.length === 0) {
        lines = SAMPLE_LYRICS.slice(0, 5);
      }
    }
    
    // Set lyrics lines for preview
    setLyricsLines(lines.slice(0, 5)); // Limit to 5 lines for the card
    
    // Animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    
  }, [lyrics]);
  
  // Helper function to adjust color opacity
  function adjustColorOpacity(hex, opacity) {
    if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
      return 'rgba(29, 185, 84, 0.9)';
    }
    
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    
    // Return with opacity
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.95}
        onPress={onPress}
        style={[styles.card, { backgroundColor: adjustColorOpacity(baseColor, 0.15) }]}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: baseColor }]} />
        
        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titleText}>LYRICS</Text>
            <TouchableOpacity style={styles.expandButton}>
              <Ionicons name="chevron-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {/* Lyrics content */}
          <View style={styles.lyricsContent}>
            {lyricsLines.map((line, index) => (
              <Text 
                key={index} 
                style={[
                  styles.lyricLine,
                  index === 0 && styles.activeLyricLine
                ]}
                numberOfLines={1}
              >
                {line}
              </Text>
            ))}
          </View>
          
          {/* Bottom indicator */}
          <View style={styles.bottomIndicator}>
            <View style={[styles.indicator, { backgroundColor: baseColor }]} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(10px)',
  },
  accentBar: {
    width: 4,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricsContent: {
    marginBottom: 16,
  },
  lyricLine: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  activeLyricLine: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  bottomIndicator: {
    alignItems: 'center',
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});

export default MiniLyrics; 