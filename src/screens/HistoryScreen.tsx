import React, {useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {images} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenHeader} from '../components/ScreenHeader';
import {StreakPill} from '../components/StreakPill';
import {TabScrollView} from '../components/TabScrollView';
import {sports, getSportById} from '../data/sports';
import {useAppState} from '../state/AppState';
import {colors} from '../styles/theme';
import type {SportId, TabId} from '../types/app';
import {formatSessionDate, formatTotalTime} from '../utils/date';

type HistoryScreenProps = {
  bottomInset: number;
  goToTab: (tab: TabId) => void;
};

type FilterId = 'all' | SportId;

export const HistoryScreen = ({bottomInset, goToTab}: HistoryScreenProps) => {
  const {data, deleteSession} = useAppState();
  const [filter, setFilter] = useState<FilterId>('all');

  const filteredSessions = useMemo(
    () =>
      filter === 'all'
        ? data.sessions
        : data.sessions.filter(session => session.sportId === filter),
    [data.sessions, filter],
  );

  const totalSeconds = data.sessions.reduce(
    (sum, session) => sum + session.elapsedSeconds,
    0,
  );

  const confirmDelete = (sessionId: string) => {
    Alert.alert('Delete session?', 'This save will be removed from history.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteSession(sessionId),
      },
    ]);
  };

  return (
    <TabScrollView bottomInset={bottomInset}>
      <ScreenHeader
        eyebrow="YOUR JOURNEY"
        title="Activity History"
        right={<StreakPill />}
      />
      <View style={styles.stats}>
        <View style={[styles.statCard, styles.statCardActive]}>
          <Text style={styles.statValue}>{data.sessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatTotalTime(totalSeconds)}</Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>
      <View style={styles.filters}>
        <FilterChip
          label="🏅 All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        {sports.map(sport => (
          <FilterChip
            key={sport.id}
            label={`${sport.emoji} ${sport.name}`}
            active={filter === sport.id}
            onPress={() => setFilter(sport.id)}
          />
        ))}
      </View>
      {filteredSessions.length === 0 ? (
        <View style={styles.empty}>
          <Image source={images.rooPresenting} style={styles.emptyRoo} />
          <Text style={styles.emptyText}>
            You have no saves in this category yet.
          </Text>
          <PrimaryButton
            label="Go to Tracker"
            onPress={() => goToTab('tracker')}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <View style={styles.list}>
          {filteredSessions.map(session => {
            const sport = getSportById(session.sportId);

            return (
              <View key={session.id} style={styles.sessionCard}>
                <View style={[styles.sessionIcon, {backgroundColor: sport.color}]}>
                  <Text style={styles.sessionEmoji}>{sport.emoji}</Text>
                </View>
                <View style={styles.sessionBody}>
                  <Text style={styles.sessionTitle} numberOfLines={1}>
                    {session.name}
                  </Text>
                  <Text style={styles.sessionDescription} numberOfLines={1}>
                    {session.description || sport.description}
                  </Text>
                  <Text style={styles.sessionMeta}>
                    ◷ {Math.max(1, Math.round(session.elapsedSeconds / 60))}m
                    {'  '}▣ {formatSessionDate(session.completedAt)}
                  </Text>
                </View>
                <View style={styles.sessionRight}>
                  <View style={[styles.sportBadge, {borderColor: sport.color}]}>
                    <Text style={[styles.sportBadgeText, {color: sport.accent}]}>
                      {sport.name}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => confirmDelete(session.id)}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteText}>×</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </TabScrollView>
  );
};

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.filterChip, active && styles.filterChipActive]}>
    <Text
      numberOfLines={1}
      style={[styles.filterText, active && styles.filterTextActive]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    minHeight: 72,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 14,
    justifyContent: 'center',
  },
  statCardActive: {
    borderColor: colors.yellow,
    backgroundColor: 'rgba(255, 212, 0, 0.08)',
  },
  statValue: {
    color: colors.text,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    marginHorizontal: -4,
    paddingHorizontal: 4,
    flexWrap: 'wrap',
  },
  filterChip: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  filterChipActive: {
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
  },
  filterText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  filterTextActive: {
    color: colors.yellow,
    fontWeight: '900',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyRoo: {
    width: 210,
    height: 260,
    resizeMode: 'contain',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyButton: {
    alignSelf: 'stretch',
    marginTop: 36,
  },
  list: {
    gap: 12,
    marginTop: 14,
  },
  sessionCard: {
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  sessionIcon: {
    width: 58,
    height: 58,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionEmoji: {
    fontSize: 30,
  },
  sessionBody: {
    flex: 1,
    minWidth: 0,
  },
  sessionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  sessionDescription: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  sessionMeta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  sessionRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  sportBadge: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: 'rgba(36, 192, 90, 0.08)',
  },
  sportBadgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  deleteText: {
    color: colors.muted,
    fontSize: 17,
    fontWeight: '900',
  },
});
