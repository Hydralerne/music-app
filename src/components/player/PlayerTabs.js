import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

const PlayerTabs = ({ activeTab, onTabChange }) => {
  const indicatorLeft = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    let toValue = 0;
    if (activeTab === 'player') toValue = 0;
    else if (activeTab === 'lyrics') toValue = 1;
    else if (activeTab === 'related') toValue = 2;
    
    Animated.spring(indicatorLeft, {
      toValue,
      tension: 60,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);
  
  const leftPosition = indicatorLeft.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0%', '33.33%', '66.66%'],
  });
  
  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={styles.tabsContainer}>
        <View style={styles.tabsWrapper}>
          <Animated.View 
            style={[
              styles.indicator, 
              { left: leftPosition }
            ]} 
          />
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => onTabChange('player')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'player' && styles.activeTabText
            ]}>
              Player
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => onTabChange('lyrics')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'lyrics' && styles.activeTabText
            ]}>
              Lyrics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tab}
            onPress={() => onTabChange('related')}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tabText, 
              activeTab === 'related' && styles.activeTabText
            ]}>
              Related
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    paddingBottom: 10,
  },
  tabsContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tabsWrapper: {
    flexDirection: 'row',
    position: 'relative',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    width: '33.33%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    top: 4,
    zIndex: 0,
    marginLeft: 4,
  },
});

export default PlayerTabs; 