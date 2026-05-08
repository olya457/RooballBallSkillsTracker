jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const {View} = require('react-native');
  const insets = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  const frame = {
    x: 0,
    y: 0,
    width: 390,
    height: 844,
  };
  const SafeAreaInsetsContext = React.createContext(insets);
  const SafeAreaFrameContext = React.createContext(frame);

  return {
    SafeAreaProvider: ({children}) =>
      React.createElement(
        SafeAreaInsetsContext.Provider,
        {value: insets},
        React.createElement(
          SafeAreaFrameContext.Provider,
          {value: frame},
          children,
        ),
      ),
    SafeAreaView: View,
    SafeAreaConsumer: ({children}) =>
      children(insets),
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: {
      frame,
      insets,
    },
  };
});
