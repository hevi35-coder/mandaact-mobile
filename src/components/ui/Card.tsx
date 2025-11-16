import React from 'react';
import { View, Pressable, ViewProps } from 'react-native';

type CardVariant = 'default' | 'bordered' | 'elevated';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'bg-white rounded-xl';

  // Variant styles
  const variantStyles = {
    default: '',
    bordered: 'border border-gray-200',
    elevated: 'shadow-md',
  };

  // Padding styles
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const containerClassName = [
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    className,
  ].join(' ');

  if (onPress) {
    return (
      <Pressable
        className={containerClassName}
        onPress={onPress}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={containerClassName} {...props}>
      {children}
    </View>
  );
};

export default Card;
