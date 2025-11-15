module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
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
      ],
    ],
  };
};