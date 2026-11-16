// Pure-logic tests import feature indexes that pull in animated components. Reanimated's own mock loads its worklets runtime, which
// throws here ("runOnUISync is not supported on web"), so this small stand-in takes its place: plain values, a plain View, no animation.
// A test that needs more declares its own `jest.mock('react-native-reanimated', ...)`.
jest.mock('react-native-reanimated', () => {
  const { View, Text, ScrollView } = require('react-native');
  // Layout animations are chained (`FadeIn.duration(200)`): any chain is a no-op value.
  const noop = () => new Proxy(() => noop(), { get: () => noop() });
  const Easing = new Proxy({}, { get: () => (...args) => (args.length ? args[0] : 0) });
  return {
    __esModule: true,
    default: { View, Text, ScrollView, createAnimatedComponent: (component) => component },
    Easing,
    useReducedMotion: () => true,
    useSharedValue: (value) => ({ value }),
    useAnimatedStyle: (factory) => factory(),
    useDerivedValue: (factory) => ({ value: factory() }),
    useAnimatedScrollHandler: () => noop(),
    withTiming: (value) => value,
    withSpring: (value) => value,
    withDelay: (_delay, value) => value,
    withRepeat: (value) => value,
    withSequence: (...values) => values[values.length - 1],
    cancelAnimation: () => {},
    runOnJS: (fn) => fn,
    interpolate: (_value, _input, output) => output[0],
    interpolateColor: (_value, _input, output) => output[0],
    Extrapolation: { CLAMP: 'clamp' },
    FadeIn: noop(),
    FadeOut: noop(),
    LinearTransition: noop(),
  };
});

// Sentry is native; tests that import `lib/monitoring` (through any feature) get a stand-in that records calls and sends nothing.
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({ registerNavigationContainer: jest.fn() })),
  wrap: (component) => component,
}));
