import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../styles/theme';
import {useAppState} from '../state/AppState';
import {dayKey, getRecentDays} from '../utils/date';

const getStreak = (doneKeys: Set<string>) => {
  let streak = 0;
  const cursor = new Date();

  while (doneKeys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const StreakPill = () => {
  const {data} = useAppState();

  const streak = useMemo(() => {
    const keys = new Set(
      data.sessions.map(session => session.completedAt.slice(0, 10)),
    );

    if (keys.size === 0) {
      getRecentDays()
        .slice(-3)
        .forEach(day => keys.add(day.key));
    }

    return Math.max(getStreak(keys), keys.size === 3 ? 3 : 0);
  }, [data.sessions]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>🔥 {streak}d</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    minWidth: 64,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 24,
  },
  text: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '900',
  },
});
