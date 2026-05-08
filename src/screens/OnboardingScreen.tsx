import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo, useState} from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {onboardingSlides} from '../data/onboarding';
import {colors, getBottomGap, getTopGap, gradients, shadow} from '../styles/theme';
import {useAppState} from '../state/AppState';
import type {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = ({navigation}: Props) => {
  const [index, setIndex] = useState(0);
  const {height, width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {completeOnboarding, data} = useAppState();
  const slide = onboardingSlides[index];
  const compact = height < 730;
  const circleSize = useMemo(
    () => Math.min(width * (compact ? 0.74 : 0.82), compact ? 270 : 330),
    [compact, width],
  );
  const mascotHeight = circleSize * (compact ? 0.86 : 0.94);

  const finish = () => {
    completeOnboarding();

    if (data.hasAcceptedDisclaimer) {
      navigation.replace('Main');
      return;
    }

    navigation.replace('Disclaimer');
  };

  const next = () => {
    if (index === onboardingSlides.length - 1) {
      finish();
      return;
    }

    setIndex(current => current + 1);
  };

  return (
    <LinearGradient colors={gradients.app} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: getTopGap(insets.top),
            paddingBottom: getBottomGap(insets.bottom),
            minHeight: height,
          },
        ]}>
        <View style={styles.skipRow}>
          <Pressable onPress={finish} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.hero,
            compact && styles.heroCompact,
            {width: circleSize, height: circleSize},
          ]}>
          <View style={styles.outerRing} />
          <View style={styles.middleRing} />
          <View style={styles.innerCircle} />
          <Image
            source={slide.image}
            resizeMode="contain"
            style={[
              styles.mascot,
              {
                width: circleSize * 0.82,
                height: mascotHeight,
              },
            ]}
          />
        </View>

        <View style={styles.copy}>
          <Text style={[styles.eyebrow, {color: slide.accent}]}>
            {slide.eyebrow}
          </Text>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            {slide.title}
          </Text>
          <Text style={[styles.body, compact && styles.bodyCompact]}>
            {slide.body}
          </Text>
        </View>

        <View style={styles.dots}>
          {onboardingSlides.map((item, dotIndex) => (
            <View
              key={item.title}
              style={[
                styles.dot,
                dotIndex === index && styles.activeDot,
                dotIndex === index && {backgroundColor: slide.accent},
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={next}
          style={[
            styles.continueButton,
            Platform.OS === 'android' && styles.continueButtonAndroid,
            shadow,
          ]}>
          <LinearGradient colors={gradients.yellow} style={styles.continueBg}>
            <Text style={styles.continueText}>
              {index === onboardingSlides.length - 1
                ? 'Get Started'
                : 'Continue'}{' '}
              ›
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  skipRow: {
    alignItems: 'flex-end',
    minHeight: 34,
  },
  skipButton: {
    minWidth: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: colors.mutedStrong,
    fontWeight: '800',
    fontSize: 12,
  },
  hero: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  heroCompact: {
    marginTop: -4,
  },
  outerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(124, 48, 194, 0.28)',
    shadowColor: colors.purple,
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 0},
  },
  middleRing: {
    position: 'absolute',
    width: '84%',
    height: '84%',
    borderRadius: 999,
    backgroundColor: 'rgba(104, 35, 171, 0.55)',
  },
  innerCircle: {
    position: 'absolute',
    width: '68%',
    height: '68%',
    borderRadius: 999,
    backgroundColor: '#8642D4',
  },
  mascot: {
    zIndex: 2,
  },
  copy: {
    alignItems: 'center',
    paddingHorizontal: 4,
    marginTop: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 3.6,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  titleCompact: {
    fontSize: 25,
    lineHeight: 30,
    marginBottom: 10,
  },
  body: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '700',
    textAlign: 'center',
  },
  bodyCompact: {
    fontSize: 13,
    lineHeight: 19,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4C496B',
  },
  activeDot: {
    width: 20,
  },
  continueButton: {
    borderRadius: 16,
    marginTop: 18,
  },
  continueButtonAndroid: {
    marginTop: -2,
  },
  continueBg: {
    minHeight: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: colors.bg,
    fontSize: 17,
    fontWeight: '900',
  },
});
