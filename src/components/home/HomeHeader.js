import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeHeader = ({ onProfilePress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Discover</Text>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={onProfilePress}
      >
        <Ionicons name="person-circle" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    padding: 4,
  },
});

export default HomeHeader; 