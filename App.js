import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

// Import components
import TabNavigator from './src/navigation/TabNavigator';
import MusicPlayer from './src/components/MusicPlayer';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  
  // Use useCallback to memoize the handleSelectTrack function
  const handleSelectTrack = useCallback((track) => {
    setCurrentTrack(track);
  }, []);
  
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={{ colors: { background: '#121212' } }}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <TabNavigator onSelectTrack={handleSelectTrack} />
        
        <MusicPlayer 
          track={currentTrack} 
          visible={currentTrack !== null} 
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
