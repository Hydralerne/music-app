import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const LyricsView = ({ lyrics }) => {
  // For a real implementation, you would parse lyrics and highlight current line
  const lyricsLines = lyrics ? lyrics.split('\n') : [];
  
  return (
    <View style={styles.container}>
      {lyrics ? (
        <ScrollView style={styles.lyricsScroll} contentContainerStyle={styles.lyricsContent}>
          {lyricsLines.map((line, index) => (
            <Text 
              key={index} 
              style={[
                styles.lyricsLine, 
                index === 5 && styles.activeLyricsLine // Example: highlight line 5
              ]}
            >
              {line}
            </Text>
          ))}
        </ScrollView>
      ) : (
        <BlurView intensity={20} tint="dark" style={styles.emptyContainer}>
          <Ionicons name="musical-notes" size={50} color="rgba(255,255,255,0.3)" />
          <Text style={styles.emptyText}>No lyrics available</Text>
        </BlurView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 24,
  },
  lyricsScroll: {
    flex: 1,
  },
  lyricsContent: {
    paddingBottom: 40,
  },
  lyricsLine: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 25,
    lineHeight: 40,
    textAlign: 'center',
    marginVertical: 6,
    fontWeight: '600',
  },
  activeLyricsLine: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    marginTop: 16,
  },
});

export default LyricsView; 