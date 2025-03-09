import React, { memo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import CustomTabBar from './CustomTabBar';

// Import screens
import HomeScreen from '../screens/HomeScreen';

// Create placeholder screens
const SearchScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#fff', fontSize: 18 }}>Search Screen</Text>
  </View>
);

const LibraryScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#fff', fontSize: 18 }}>Library Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const TabNavigator = memo(({ onSelectTrack }) => {
  // Create a wrapper for HomeScreen to pass onSelectTrack directly
  const HomeScreenWithProps = (props) => (
    <HomeScreen {...props} onSelectTrack={onSelectTrack} />
  );

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          position: 'absolute',
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        }
      }}
      sceneContainerStyle={{
        backgroundColor: '#121212'
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreenWithProps}
      />
      
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
      />
      
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen}
      />
    </Tab.Navigator>
  );
});

export default TabNavigator; 