import { View, Text, Modal } from 'react-native';
import React from 'react';

const ErrorModal = ({ error }: { error: string }) => {
  return (
    <View>
      <Modal visible={true} transparent={true} animationType="fade">
        <View className="bg-black/50 flex-1 justify-center items-center">
          <View className="mt-8 items-center bg-white rounded-xl p-6 mx-4 shadow-lg">
            <Text className="text-red-500 text-lg font-bold">{error}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ErrorModal;
