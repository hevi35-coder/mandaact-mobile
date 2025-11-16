import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  PressableProps,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: string | React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onPress,
  ...props
}) => {
  // Base styles
  const baseStyles = 'flex-row items-center justify-center rounded-lg';

  // Variant styles
  const variantStyles = {
    primary: disabled
      ? 'bg-gray-300'
      : 'bg-blue-600 active:bg-blue-700',
    secondary: disabled
      ? 'bg-gray-200 border border-gray-300'
      : 'bg-white border border-gray-300 active:bg-gray-50',
    ghost: disabled
      ? 'bg-transparent'
      : 'bg-transparent active:bg-gray-100',
    danger: disabled
      ? 'bg-gray-300'
      : 'bg-red-600 active:bg-red-700',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // Text variant styles
  const textVariantStyles = {
    primary: disabled ? 'text-gray-500' : 'text-white',
    secondary: disabled ? 'text-gray-400' : 'text-gray-700',
    ghost: disabled ? 'text-gray-400' : 'text-blue-600',
    danger: disabled ? 'text-gray-500' : 'text-white',
  };

  // Text size styles
  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const containerClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
  ].join(' ');

  const textClassName = [
    'font-medium text-center',
    textVariantStyles[variant],
    textSizeStyles[size],
  ].join(' ');

  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={containerClassName}
      disabled={isDisabled}
      onPress={onPress}
      {...props}
    >
      {loading ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#3b82f6'}
          />
          {typeof children === 'string' && (
            <Text className={`${textClassName} ml-2`}>{children}</Text>
          )}
        </View>
      ) : typeof children === 'string' ? (
        <Text className={textClassName}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;
