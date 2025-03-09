import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Import components
import PlayerHeader from './PlayerHeader';
import PlayerTabs from './PlayerTabs';
import AlbumArt from './AlbumArt';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import PlayerControls from './PlayerControls';
import PlayerActions from './PlayerActions';
import LyricsView from './LyricsView';
import RelatedTracks from './RelatedTracks';
import MiniLyrics from './MiniLyrics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
const BOTTOM_PADDING = Platform.OS === 'ios' ? 34 : 16;

const FullPlayer = ({
  track,
  trackInfo,
  thumbnailUrl,
  artistName,
  isPlaying,
  position,
  duration,
  loading,
  dominantColor,
  lyrics,
  relatedTracks,
  onClose,
  onTogglePlayback,
  onSeek,
  onRelatedTrackSelect,
  allowScroll
}) => {
  const [activeTab, setActiveTab] = useState('player');
  const [scrollY] = useState(new Animated.Value(0));

  // Calculate header opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  // Calculate album art scale based on scroll position
  const albumScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.1, 1, 0.9],
    extrapolate: 'clamp'
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Background image with blur */}
      <ImageBackground
        source={{ uri: thumbnailUrl || 'https://via.placeholder.com/400' }}
        style={styles.backgroundImage}
        blurRadius={80}
      >
        <View style={styles.backgroundOverlay} />
      </ImageBackground>

      {/* Floating Header - appears when scrolling */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={styles.blurView}>
          <PlayerHeader
            title={track?.title || 'Unknown Title'}
            artist={artistName || 'Unknown Artist'}
            thumbnailUrl={thumbnailUrl}
            onClose={onClose}
          />
        </BlurView>
      </Animated.View>

      {/* Main Content */}
      <View style={[styles.contentWrapper, { paddingTop: insets.top }]}>
        <PlayerHeader
          onClose={onClose}
          showOptions={true}
        />

        {/* Tabs at the top */}
        <PlayerTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <Animated.ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          scrollEnabled={allowScroll}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {activeTab === 'player' && (
            <View style={styles.playerContent}>
              {/* Album Art with parallax effect */}
              <Animated.View style={[styles.albumWrapper, { transform: [{ scale: albumScale }] }]}>
                <AlbumArt
                  thumbnailUrl={thumbnailUrl}
                  isPlaying={isPlaying}
                />

                {/* Action Buttons positioned absolutely */}
              </Animated.View>

              {/* Track Info */}
              <TrackInfo
                title={track?.title}
                artist={artistName}
              />

              {/* Progress Bar */}
              <ProgressBar
                position={position}
                duration={duration}
                onSeek={onSeek}
              />

              {/* Playback Controls */}
              <PlayerControls
                isPlaying={isPlaying}
                loading={loading}
                onTogglePlayback={onTogglePlayback}
              />

              {/* Mini Lyrics - Spotify Style */}
              <MiniLyrics
                dominantColor={dominantColor}
                onPress={() => setActiveTab('lyrics')}
                currentLyric="♪ Now playing: Current lyric line would appear here"
              />

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
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

            </View>
          )}

          {activeTab === 'lyrics' && (
            <LyricsView lyrics={lyrics} />
          )}

          {activeTab === 'related' && (
            <RelatedTracks 
              tracks={relatedTracks || []}
              onSelect={(selectedTrack) => {
                console.log('Track selected from related in FullPlayer:', selectedTrack);
                
                // Don't close the player first, just directly play the new track
                if (typeof onRelatedTrackSelect === 'function') {
                  onRelatedTrackSelect(selectedTrack);
                } else {
                  console.error('onRelatedTrackSelect is not a function');
                }
              }}
              loading={loading}
            />
          )}

          {/* Bottom padding for safe area */}
          <View style={styles.safeAreaBottom} />
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#121212',
    zIndex: 9999,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  safeAreaBottom: {
    height: BOTTOM_PADDING,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: STATUSBAR_HEIGHT + 56,
  },
  blurView: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentInner: {
    paddingBottom: 40,
  },
  albumWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  playerContent: {
    position: 'relative',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    bottom: 0,
  },
});

export default FullPlayer; 