/**
 * ✅ REACT NATIVE APP ENTRY POINT
 *
 * This is the main entry point for the React Native application
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
