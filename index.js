import {AppRegistry, NativeModules, Settings} from 'react-native';
import {name as appName} from './app.json';

const FLAG = 'reproReloadedOnce';

if (Settings.get(FLAG) !== 1) {
  Settings.set({[FLAG]: 1});
  NativeModules.ReproReload.reload();
} else {
  Settings.set({[FLAG]: 0});
}

const App = require('./App').default;
AppRegistry.registerComponent(appName, () => App);
