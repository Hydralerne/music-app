import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity,
  Dimensions
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = 160; // Square size for thumbnails

const TopPicksSection = ({ picks, onSelectTrack, accentColor = '#7B68EE' }) => {
  if (!picks || picks.length === 0) return null;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => onSelectTrack(item)}
        activeOpacity={0.8}
      >
        <View style={styles.card}>
          <Image 
            source={{ uri: item.posterLarge || item.poster }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Top Picks</Text>
      <FlatList
        data={picks}
        renderItem={renderItem}
        keyExtractor={(item) => `pick-${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    width: ITEM_SIZE,
    marginHorizontal: 8,
  },
  card: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  artist: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default TopPicksSection; 