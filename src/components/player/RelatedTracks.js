import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RelatedTracks = ({ tracks, onSelect, loading }) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B19CD9" />
        <Text style={styles.loadingText}>Loading related tracks...</Text>
      </View>
    );
  }

  if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-notes" size={60} color="rgba(255,255,255,0.3)" />
        <Text style={styles.emptyText}>No related tracks found</Text>
      </View>
    );
  }

  const handleTrackSelect = (track) => {
    console.log('Track selected in RelatedTracks:', track);
    
    // Make sure we have all the required fields
    const trackToPlay = {
      ...track,
      id: track.id || track.videoId,
      videoId: track.videoId || track.id,
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      poster: track.posterLarge || track.poster || track.thumbnail,
      posterLarge: track.posterLarge || track.poster || track.thumbnail,
    };
    
    // Call onSelect directly - don't handle closing here
    if (typeof onSelect === 'function') {
      onSelect(trackToPlay);
    } else {
      console.error('onSelect is not a function or not provided');
    }
  };

  const renderTrackItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        style={styles.trackItem}
        onPress={() => handleTrackSelect(item)}
        activeOpacity={0.7}
      >
        {/* Track number */}
        <Text style={styles.trackNumber}>{index + 1}</Text>
        
        {/* Album art */}
        <Image 
          source={{ uri: item.posterLarge || item.poster || 'https://via.placeholder.com/60' }}
          style={styles.trackImage}
        />
        
        {/* Track info */}
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
        </View>
        
        {/* Duration */}
        <Text style={styles.trackDuration}>
          {formatDuration(item.duration)}
        </Text>
        
        {/* Options button */}
        <TouchableOpacity 
          style={styles.optionsButton}
          onPress={(e) => {
            e.stopPropagation();
            console.log('Options for:', item.title);
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Helper function to format duration from milliseconds to mm:ss
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return '--:--';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>You might also like</Text>
      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item, index) => `related-${item.id || item.videoId || index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  trackNumber: {
    width: 30,
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  trackInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  trackDuration: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginRight: 10,
  },
  optionsButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 16,
    fontSize: 16,
  },
});

export default RelatedTracks; 