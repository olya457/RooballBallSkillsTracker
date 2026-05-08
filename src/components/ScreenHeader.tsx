import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/theme';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
};

export const ScreenHeader = ({eyebrow, title, right}: ScreenHeaderProps) => (
  <View style={styles.wrap}>
    <View style={styles.textWrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
        {title}
      </Text>
    </View>
    {right}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  textWrap: {
    flex: 1,
  },
  eyebrow: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
});
