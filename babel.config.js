module.exports = function (api) {
  api.cache(true);

  const presets = ['babel-preset-expo'];
  const plugins = [];

  // NativeWind
  plugins.push('nativewind/babel');

  // Module resolver
  plugins.push([
    'module-resolver',
    {
      root: ['./'],
      alias: {
        '@': './src',
        '@/components': './src/components',
        '@/screens': './src/screens',
        '@/lib': './src/lib',
        '@/store': './src/store',
        '@/types': './src/types',
        '@/hooks': './src/hooks',
        '@/services': './src/services',
        '@/constants': './src/constants',
      },
    },
  ]);

  // React Native Reanimated (must be last)
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: presets,
    plugins: plugins,
  };
};