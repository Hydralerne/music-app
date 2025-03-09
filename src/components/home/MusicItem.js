import React, { memo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MusicItem = memo(({ item, onPress }) => {
  if (!item || !item.poster) return null;

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.posterLarge || item.poster }} 
          style={styles.thumbnail} 
        />
        <View style={styles.playIconOverlay}>
          <Ionicons name="play-circle" size={36} color="rgba(255,255,255,0.9)" />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{item.artist}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  item: {
    width: 160,
    marginLeft: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  thumbnail: {
    width: 160,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  playIconOverlay: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 18,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default MusicItem; 