import React, { memo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const AlbumItem = memo(({ item, onPress }) => {
  if (!item || !item.poster) return null;

  return (
    <TouchableOpacity style={styles.albumItem} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: item.posterLarge || item.poster }} 
          style={styles.albumThumbnail} 
        />
      </View>
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.subtitle} numberOfLines={1}>{item.artist}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  albumItem: {
    width: 140,
    marginLeft: 16,
  },
  thumbnailContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  albumThumbnail: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#333',
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

export default AlbumItem; 