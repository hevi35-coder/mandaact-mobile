import React from 'react';
import { View, ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  padding = 'md',
  centered = false,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'px-3 py-3',
    md: 'px-4 py-4',
    lg: 'px-6 py-6',
  };

  const containerClassName = [
    'flex-1',
    paddingStyles[padding],
    centered ? 'items-center justify-center' : '',
    className,
  ].join(' ');

  return (
    <View className={containerClassName} {...props}>
      {children}
    </View>
  );
};

export default Container;
