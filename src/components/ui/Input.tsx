import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName = '',
  editable = true,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!error;
  const isDisabled = !editable;

  // Container styles
  const inputContainerClassName = [
    'flex-row items-center border rounded-lg px-4 py-3',
    isFocused && !hasError ? 'border-blue-600' : '',
    hasError ? 'border-red-500' : 'border-gray-300',
    isDisabled ? 'bg-gray-100' : 'bg-white',
  ].join(' ');

  // Input styles
  const inputClassName = [
    'flex-1 text-base',
    isDisabled ? 'text-gray-400' : 'text-gray-900',
  ].join(' ');

  const isSecure = secureTextEntry && !showPassword;

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}

      <View className={inputContainerClassName}>
        {leftIcon && (
          <View className="mr-3">
            {leftIcon}
          </View>
        )}

        <TextInput
          className={inputClassName}
          placeholderTextColor="#9ca3af"
          editable={editable}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="ml-3"
          >
            <Text className="text-gray-500 text-sm">
              {showPassword ? '숨기기' : '보기'}
            </Text>
          </Pressable>
        )}

        {rightIcon && !secureTextEntry && (
          <View className="ml-3">
            {rightIcon}
          </View>
        )}
      </View>

      {hasError && (
        <Text className="text-sm text-red-500 mt-1">
          {error}
        </Text>
      )}

      {helperText && !hasError && (
        <Text className="text-sm text-gray-500 mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};

export default Input;
