import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../assets';
import {colors} from '../styles/theme';
import {useAppState} from '../state/AppState';
import type {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen = ({navigation}: Props) => {
  const {width} = useWindowDimensions();
  const {data, hydrated} = useAppState();
  const pulse = useRef(new Animated.Value(0)).current;
  const logoSize = useMemo(() => Math.min(width * 0.72, 320), [width]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [pulse]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const timer = setTimeout(() => {
      if (!data.hasSeenOnboarding) {
        navigation.replace('Onboarding');
        return;
      }

      if (!data.hasAcceptedDisclaimer) {
        navigation.replace('Disclaimer');
        return;
      }

      navigation.replace('Main');
    }, 5000);

    return () => clearTimeout(timer);
  }, [
    data.hasAcceptedDisclaimer,
    data.hasSeenOnboarding,
    hydrated,
    navigation,
  ]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1.04],
  });
  const rotate = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });
  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });

  return (
    <LinearGradient colors={['#08091B', '#050617']} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.glow,
            {
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              opacity,
              transform: [{scale}, {rotate}],
            },
          ]}>
          <Image
            source={images.loader}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
