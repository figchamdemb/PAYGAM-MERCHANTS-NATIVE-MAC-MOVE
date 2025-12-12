module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/navigation': './src/navigation',
          '@/services': './src/services',
          '@/store': './src/store',
          '@/config': './src/config',
          '@/utils': './src/utils',
          '@/hooks': './src/hooks',
          '@/types': './src/types',
          '@/assets': './src/assets',
        },
      },
    ],
    // react-native-reanimated/plugin must be listed last
    'react-native-reanimated/plugin',
  ],
};
