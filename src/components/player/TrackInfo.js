import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const TrackInfo = ({ title, artist }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title || 'Unknown Title'}
        </Text>
        <Text style={styles.artist}>
          {artist || 'Unknown Artist'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.likeButtonContainer}
        onPress={() => console.log('Like button pressed')}
      >
        <Ionicons name="heart-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    marginRight: 50
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  likeButtonContainer: {
    position: 'absolute',
    right: 0,
    marginRight: 20,
  }
});

export default TrackInfo; 