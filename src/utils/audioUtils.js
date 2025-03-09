import { filter } from '@hydralerne/youtube-api';

// Custom filter function that prefers m4a format with good quality
export const filterAudioFormat = (formats) => {
  try {
    // Try to get mp4a format with good quality (at least 128kbps)
    const bestAudio = filter(formats, 'bestaudio', { minBitrate: 128000, codec: 'mp4a' });
    
    if (bestAudio && bestAudio.url) {
      return bestAudio;
    }
    
    // Fallback to any audio format
    return filter(formats, 'bestaudio');
  } catch (error) {
    console.error('Error filtering audio format:', error);
    
    // If the filter fails, try to find any audio format manually
    if (formats && formats.length) {
      // Sort by audio quality (bitrate)
      const audioFormats = formats
        .filter(f => f.audioQuality && f.url)
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
      
      if (audioFormats.length > 0) {
        return audioFormats[0];
      }
    }
    
    return null;
  }
}; 