import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
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
import {PrimaryButton} from '../components/PrimaryButton';
import {colors, getBottomGap, getTopGap, gradients} from '../styles/theme';
import {useAppState} from '../state/AppState';
import type {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Disclaimer'>;

export const DisclaimerScreen = ({navigation}: Props) => {
  const [checked, setChecked] = useState(false);
  const {height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {acceptDisclaimer} = useAppState();

  const agree = () => {
    acceptDisclaimer();
    navigation.replace('Main');
  };

  return (
    <LinearGradient colors={gradients.app} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            minHeight: height,
            paddingTop: getTopGap(insets.top),
            paddingBottom: getBottomGap(insets.bottom),
          },
        ]}>
        <View style={styles.iconBox}>
          <Text style={styles.warning}>⚠</Text>
        </View>

        <Text style={styles.title}>Before You Begin</Text>
        <Text style={styles.subtitle}>Please read and accept to continue</Text>

        <View style={styles.notice}>
          <View style={styles.noticeHeader}>
            <Text style={styles.noticeHeaderText}>⚠ IMPORTANT NOTICE</Text>
          </View>
          <Text style={styles.noticeText}>
            This app provides general recommendations and is{' '}
            <Text style={styles.highlight}>
              not intended to be medical or professional sports advice.
            </Text>{' '}
            You use it at your own risk, and the developers are{' '}
            <Text style={styles.highlight}>not responsible</Text> for any
            injuries or consequences.
          </Text>
          <View style={styles.divider} />
          <Text style={styles.noticeText}>
            For safe and effective training, it is recommended to exercise under
            the supervision of a{' '}
            <Text style={styles.highlight}>qualified trainer.</Text>
          </Text>
          <View style={styles.bullets}>
            {[
              'General recommendations only',
              'Use at your own risk',
              'Consult a professional trainer',
              'Developers bear no responsibility',
            ].map(item => (
              <View key={item} style={styles.bulletRow}>
                <View style={styles.bulletIcon}>
                  <Text style={styles.bulletMark}>!</Text>
                </View>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => setChecked(current => !current)}
          style={[styles.checkboxCard, checked && styles.checkboxCardActive]}>
          <View style={[styles.checkbox, checked && styles.checkboxActive]}>
            <Text style={styles.checkMark}>{checked ? '✓' : ''}</Text>
          </View>
          <Text style={styles.checkboxText}>
            I have read and understand this disclaimer. I agree to use this app
            responsibly.
          </Text>
        </Pressable>

        <PrimaryButton
          label="I Agree — Let's Train! ›"
          onPress={agree}
          disabled={!checked}
          style={styles.button}
        />
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
    justifyContent: 'center',
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: 'rgba(255, 155, 17, 0.1)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  warning: {
    color: colors.orange,
    fontSize: 34,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  notice: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    borderRadius: 24,
    padding: 20,
  },
  noticeHeader: {
    backgroundColor: 'rgba(255, 155, 17, 0.12)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  noticeHeaderText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  noticeText: {
    color: '#D8D5E8',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
  },
  highlight: {
    color: colors.yellow,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    backgroundColor: '#302D52',
    marginVertical: 18,
  },
  bullets: {
    gap: 12,
    marginTop: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 155, 17, 0.18)',
    borderWidth: 1,
    borderColor: colors.borderWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletMark: {
    color: colors.orange,
    fontSize: 11,
    fontWeight: '900',
  },
  bulletText: {
    color: colors.mutedStrong,
    fontSize: 14,
    flex: 1,
  },
  checkboxCard: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    marginTop: 22,
  },
  checkboxCardActive: {
    borderColor: colors.yellow,
    backgroundColor: 'rgba(255, 212, 0, 0.08)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: colors.yellow,
  },
  checkMark: {
    color: colors.yellow,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 17,
  },
  checkboxText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  button: {
    marginTop: 18,
  },
});
