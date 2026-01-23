import { View, Animated, Easing, Modal } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loading = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View>
      <Modal visible={true} transparent={true} animationType="fade">
        <View className="bg-black/50 flex-1 justify-center items-center">
          <View className="mt-8 items-center bg-white rounded-xl p-6 mx-4 shadow-lg">
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <FontAwesomeIcon icon={faSpinner} size={24} />
            </Animated.View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Loading;
