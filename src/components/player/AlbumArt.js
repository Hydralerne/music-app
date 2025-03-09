import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ALBUM_SIZE = SCREEN_WIDTH - 48; // Full width minus padding

const AlbumArt = ({ thumbnailUrl }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: thumbnailUrl || 'https://via.placeholder.com/400' }} 
        style={styles.albumCover}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  albumCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
  },
});

export default AlbumArt; 