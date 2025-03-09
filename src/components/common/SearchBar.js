import React from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-linear-gradient';

const SearchBar = ({ 
  value, 
  onChangeText, 
  onSubmit, 
  onFocus, 
  onBlur, 
  onClear,
  placeholder = 'Search for songs, artists...'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        {/* Search Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.7)" />
        </View>
        
        {/* Text Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor="#fff"
        />
        
        {/* Clear Button */}
        {value ? (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={onClear}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={18} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontWeight: '400',
  },
  clearButton: {
    padding: 6,
  },
});

export default SearchBar; 