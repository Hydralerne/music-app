import React from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlayerControls = ({ isPlaying, loading, onTogglePlayback }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.secondaryControl}>
        <Ionicons name="shuffle" size={22} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryControl}>
        <Ionicons name="play-skip-back" size={26} color="#fff" />
      </TouchableOpacity>

      {loading ? (
        <View style={styles.playPauseContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.playPauseContainer}
          onPress={onTogglePlayback}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={40}
            color="#fff"
            style={isPlaying ? {} : { marginLeft: 4 }}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.primaryControl}>
        <Ionicons name="play-skip-forward" size={26} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryControl}>
        <Ionicons name="repeat" size={22} color="rgba(255,255,255,0.7)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 30,
  },
  secondaryControl: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryControl: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default PlayerControls; 