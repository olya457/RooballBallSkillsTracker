import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  jest.useFakeTimers();
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });

  await act(async () => {
    renderer?.unmount();
  });

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
