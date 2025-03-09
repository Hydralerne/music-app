import React, { memo } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SearchResults = memo(({ results, onSelectTrack }) => {
  if (!results || results.length === 0) {
    return (
      <View style={styles.emptySearch}>
        <Text style={styles.emptySearchText}>No results found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `search-${item.videoId || index}`}
      renderItem={({ item }) => {
        // Use poster or thumbnails, with fallback
        const thumbnailUrl = item.poster || 
                            (item.thumbnails && item.thumbnails.length > 0 ? item.thumbnails[0].url : null);
        
        // Skip items without valid thumbnails
        if (!thumbnailUrl) return null;
          
        return (
          <TouchableOpacity 
            style={styles.searchResultItem}
            onPress={() => onSelectTrack(item)}
          >
            <View style={styles.thumbnailContainer}>
              <Image 
                source={{ uri: thumbnailUrl }} 
                style={styles.searchThumbnail} 
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                style={styles.thumbnailGradient}
              />
              <View style={styles.playIconContainer}>
                <Ionicons name="play-circle" size={24} color="#fff" />
              </View>
            </View>
            <View style={styles.searchItemInfo}>
              <Text style={styles.searchItemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.searchItemArtist} numberOfLines={1}>
                {item.artists?.map(a => a.name).join(', ') || item.artist || 'Unknown Artist'}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={styles.searchResultsList}
      showsVerticalScrollIndicator={false}
    />
  );
});

const styles = StyleSheet.create({
  searchResultsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 70,
    height: 70,
    backgroundColor: '#333',
  },
  searchThumbnail: {
    width: 70,
    height: 70,
  },
  thumbnailGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  playIconContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  searchItemInfo: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchItemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchItemArtist: {
    color: '#aaa',
    fontSize: 14,
  },
  emptySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptySearchText: {
    color: '#aaa',
    fontSize: 16,
  },
});

export default SearchResults; 