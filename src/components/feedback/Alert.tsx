import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
  visible: boolean;
  title: string;
  message?: string;
  type?: AlertType;
  buttons?: AlertButton[];
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: '확인', style: 'default' }],
  onClose,
}) => {
  const { width } = Dimensions.get('window');
  const modalWidth = Math.min(width * 0.85, 400);

  // Type-based colors
  const typeColors = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0"
          onPress={onClose}
        />

        <View
          className="bg-white rounded-2xl overflow-hidden"
          style={{ width: modalWidth }}
        >
          {/* Content */}
          <View className="p-6">
            <Text className={`text-xl font-bold ${typeColors[type]} mb-2`}>
              {title}
            </Text>
            {message && (
              <Text className="text-gray-600 text-base leading-6">
                {message}
              </Text>
            )}
          </View>

          {/* Buttons */}
          <View className="border-t border-gray-200">
            {buttons.length === 1 ? (
              <Pressable
                onPress={() => handleButtonPress(buttons[0])}
                className="py-4 items-center active:bg-gray-50"
              >
                <Text
                  className={
                    buttons[0].style === 'destructive'
                      ? 'text-red-600 font-semibold text-base'
                      : 'text-blue-600 font-semibold text-base'
                  }
                >
                  {buttons[0].text}
                </Text>
              </Pressable>
            ) : (
              <View className="flex-row">
                {buttons.map((button, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <View className="w-px bg-gray-200" />
                    )}
                    <Pressable
                      onPress={() => handleButtonPress(button)}
                      className="flex-1 py-4 items-center active:bg-gray-50"
                    >
                      <Text
                        className={
                          button.style === 'destructive'
                            ? 'text-red-600 font-semibold text-base'
                            : button.style === 'cancel'
                            ? 'text-gray-600 text-base'
                            : 'text-blue-600 font-semibold text-base'
                        }
                      >
                        {button.text}
                      </Text>
                    </Pressable>
                  </React.Fragment>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
