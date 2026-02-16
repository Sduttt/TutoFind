import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';

interface VideoSplashScreenProps {
  onFinished: () => void;
}

const VideoSplashScreen: React.FC<VideoSplashScreenProps> = ({
  onFinished,
}) => {
  return (
    <View className="flex-1 bg-white">
      <Video
        source={{ uri: 'asset:///splash.mp4' }}
        style={styles.video}
        resizeMode="cover"
        onEnd={onFinished}
        onError={e => {
          console.error('Video Error:', e);
          onFinished(); // Fallback to app if video fails
        }}
        muted={true}
        repeat={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default VideoSplashScreen;
