import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  StyleSheet, 
  View, 
  StatusBar, 
  Animated, 
  Platform,
  ScrollView,
  Text,
  ImageBackground,
  Dimensions
} from 'react-native';
import { getHome, youtubeMusicSearch } from '@hydralerne/youtube-api';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Import components
import SearchBar from '../components/common/SearchBar';
import LoadingIndicator from '../components/common/LoadingIndicator';
import SearchResults from '../components/home/SearchResults';
import HomeHeader from '../components/home/HomeHeader';
import TopPicksSection from '../components/home/TopPicksSection';
import AlbumsSection from '../components/home/AlbumsSection';
import FeaturedCard from '../components/home/FeaturedCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

// Primary color theme - replacing green with a more modern blue/purple
const PRIMARY_COLOR = '#7B68EE'; // Medium slate blue
const SECONDARY_COLOR = '#9370DB'; // Medium purple
const ACCENT_COLOR = '#B19CD9'; // Light purple

// Use memo to prevent re-renders when props haven't changed
const HomeScreen = memo(({ navigation, route, onSelectTrack }) => {
  const [musicData, setMusicData] = useState({
    picks: [],
    albums: [],
    singles: [],
    featuredCards: [] // Apple Music style cards
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const scrollY = new Animated.Value(0);
  

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getHome();
      
      // Create sample featured cards in Apple Music style
      // In a real app, you would use the Apple Music API data
      const sampleFeaturedCards = [
        
        {
          title: "Chill Mix",
          description: "Relax with these handpicked tracks just for you.",
          poster: "https://is1-ssl.mzstatic.com/image/thumb/Features/v4/38/9f/29/389f297c-4d06-c6a7-0f0e-5b1a3e64a085/f86be3ee-2a12-40a0-bb63-72bf4d2a05e3.png/2500x1550bb.webp",
          heading: "MADE FOR YOU",
          type: "playlist"
        },
        {
          title: "Today's Hits",
          description: "The biggest songs right now.",
          poster: "https://is1-ssl.mzstatic.com/image/thumb/Features128/v4/6e/64/cf/6e64cf8d-cbcb-1c00-9fdf-1e05fd0e5eb3/pr_source.png/2500x1550bb.webp",
          heading: "FEATURED PLAYLIST",
          type: "playlist"
        },
        {
          title: "New Music Daily",
          description: "The latest and greatest songs added every day.",
          poster: "https://is1-ssl.mzstatic.com/image/thumb/Features211/v4/63/6d/5f/636d5f2b-f70a-def6-ec6e-5407c8cf5c38/35c5eee6-f631-4726-ad30-bff96fbe6e1f.png/2500x1550bb.webp",
          heading: "UPDATED PLAYLIST",
          type: "playlist"
        }
      ];
      
      // Check if data has the expected structure
      if (data && (data.picks || data.albums || data.singles)) {
        setMusicData({
          picks: data.picks || [],
          albums: data.albums || [],
          singles: data.singles || [],
          featuredCards: sampleFeaturedCards // Add the featured cards
        });
      } else {
        throw new Error('Invalid data format');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching home data:', err);
      setError('Failed to load music data. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const results = await youtubeMusicSearch(searchQuery, 'songs');
      
      if (results && !results.error && Array.isArray(results)) {
        setSearchResults(results);
      } else {
        throw new Error(results?.error || 'Search failed');
      }
      
      setIsSearching(false);
    } catch (err) {
      console.error('Search error:', err);
      setIsSearching(false);
    }
  };

  // Use useCallback to memoize the handleMusicItemPress function
  const handleMusicItemPress = useCallback((item) => {
    // Make sure we have valid data before passing to player
    if (!item || !onSelectTrack) return;
    
    // Ensure we have a valid thumbnail URL
    const thumbnailUrl = item.posterLarge || item.poster || 
                        (item.thumbnails && item.thumbnails.length > 0 ? item.thumbnails[0].url : null);
    
    // Only proceed if we have a valid thumbnail
    if (!thumbnailUrl) {
      console.warn('No valid thumbnail found for item:', item);
      return;
    }
    
    onSelectTrack({
      videoId: item.id || item.videoId,
      title: item.title || 'Unknown Title',
      artists: [{ name: item.artist || (item.artists && item.artists[0] ? item.artists[0].name : 'Unknown Artist') }],
      thumbnails: [{ url: thumbnailUrl }]
    });
  }, [onSelectTrack]);

  if (loading) {
    return <LoadingIndicator loading={true} />;
  }

  if (error) {
    return <LoadingIndicator error={error} onRetry={fetchHomeData} />;
  }

  const hasContent = musicData.picks.length > 0 || 
                     musicData.albums.length > 0 || 
                     musicData.singles.length > 0 ||
                     musicData.featuredCards.length > 0;
                     
  // Get background image from first pick if available
  const backgroundImage = musicData.picks && musicData.picks.length > 0 
    ? musicData.picks[0].posterLarge || musicData.picks[0].poster 
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Image with Gradient */}
      <View style={styles.backgroundContainer}>
        {backgroundImage ? (
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.backgroundImage}
            blurRadius={80}
          >
            <LinearGradient
              colors={['rgba(10, 10, 10, 0.3)', 'rgba(10, 10, 10, 0.6)', 'rgba(10, 10, 10, 0.9)', '#121212']}
              style={styles.gradient}
            />
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={['#1E1E1E', '#121212']}
            style={styles.gradient}
          />
        )}
      </View>
   
      
      {/* Header */}
      <HomeHeader onProfilePress={() => console.log('Profile pressed')} />
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          onFocus={() => setSearchMode(true)}
          onBlur={() => {
            if (!searchQuery) setSearchMode(false);
          }}
          onClear={() => {
            setSearchQuery('');
            setSearchResults(null);
            setSearchMode(false);
          }}
          accentColor={PRIMARY_COLOR}
        />
      </View>

      {isSearching ? (
        <LoadingIndicator loading={true} color={PRIMARY_COLOR} />
      ) : searchMode && searchResults ? (
        <SearchResults results={searchResults} onSelectTrack={handleMusicItemPress} accentColor={PRIMARY_COLOR} />
      ) : (
        <Animated.ScrollView 
          style={styles.content}
          contentContainerStyle={[
            styles.contentContainer,
            !hasContent && styles.emptyContentContainer
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Discover your favorite music</Text>
          </View>
          
          {/* Top Picks Section - Now with square thumbnails */}
          <TopPicksSection 
            picks={musicData.picks} 
            onSelectTrack={handleMusicItemPress}
            accentColor={PRIMARY_COLOR}
          />
          
          {/* Featured Cards (Apple Music Style) - Now positioned after Top Picks */}
          {musicData.featuredCards.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Featured</Text>
              <View style={styles.featuredCardsContainer}>
                {musicData.featuredCards.map((card, index) => (
                  <FeaturedCard 
                    key={`featured-${index}`}
                    card={card}
                    onPress={() => console.log('Featured card pressed:', card.title)}
                  />
                ))}
              </View>
            </View>
          )}
          
          {/* Albums Section */}
          <AlbumsSection 
            albums={musicData.albums} 
            title="Albums"
            onSelectAlbum={(album) => console.log('Album selected:', album.title)}
            accentColor={PRIMARY_COLOR}
          />
          
          {/* Singles Section */}
          <AlbumsSection 
            albums={musicData.singles} 
            title="Singles"
            onSelectAlbum={handleMusicItemPress}
            accentColor={PRIMARY_COLOR}
          />
          
          {/* If there are no sections */}
          {!hasContent && (
            <LoadingIndicator 
              error="No music content available" 
              onRetry={fetchHomeData}
              color={PRIMARY_COLOR}
            />
          )}
        </Animated.ScrollView>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: STATUSBAR_HEIGHT,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
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
  floatingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  floatingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 150, // Increased padding to account for mini player and tab bar
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  featuredCardsContainer: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen; 