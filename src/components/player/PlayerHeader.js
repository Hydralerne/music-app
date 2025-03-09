import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PlayerHeader = ({ title, artist, thumbnailUrl, onClose, showOptions = false }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={onClose}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="chevron-down" size={28} color="#fff" />
      </TouchableOpacity>
      
      {title && artist ? (
        <View style={styles.headerInfo}>
          {thumbnailUrl && (
            <Image 
              source={{ uri: thumbnailUrl }} 
              style={styles.headerThumbnail} 
            />
          )}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.headerArtist} numberOfLines={1}>{artist}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>Now Playing</Text>
        </View>
      )}
      
      {showOptions && (
        <TouchableOpacity 
          style={styles.optionsButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    width: '100%',
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerThumbnail: {
    width: 36,
    height: 36,
    borderRadius: 4,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  headerTitleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlayerHeader; 