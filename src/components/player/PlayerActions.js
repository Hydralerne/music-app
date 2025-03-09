import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PlayerActions = ({ dominantColor }) => {
  // Convert dominant color to a more transparent version for gradient
  const transparentColor = dominantColor ? `${dominantColor}50` : 'rgba(255,255,255,0.1)';
  
  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-sharp" size={22} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-sharp" size={22} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="arrow-down-sharp" size={22} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-sharp" size={22} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-horizontal-sharp" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.lyricsPreviewContainer}>
        <LinearGradient
          colors={[dominantColor || 'rgba(255,255,255,0.2)', transparentColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.lyricsGradient}
        >
          <View style={styles.lyricsContent}>
            <Ionicons name="musical-notes-sharp" size={18} color="#fff" style={styles.lyricsIcon} />
            <Text style={styles.lyricsText} numberOfLines={2}>
              Tap to view lyrics and sing along with this track...
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lyricsPreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 60,
  },
  lyricsGradient: {
    flex: 1,
    padding: 16,
  },
  lyricsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lyricsIcon: {
    marginRight: 12,
  },
  lyricsText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});

export default PlayerActions; 
