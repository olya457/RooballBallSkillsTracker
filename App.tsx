import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AppNavigator} from './src/navigation/AppNavigator';
import {AppStateProvider} from './src/state/AppState';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <AppNavigator />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}

export default App;
