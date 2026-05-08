import React, {useMemo, useState} from 'react';
import {
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScreenHeader} from '../components/ScreenHeader';
import {StreakPill} from '../components/StreakPill';
import {TabScrollView} from '../components/TabScrollView';
import {allFacts, facts} from '../data/facts';
import {getSportById, sports} from '../data/sports';
import {colors} from '../styles/theme';
import type {Fact, SportId} from '../types/app';

type FactsScreenProps = {
  bottomInset: number;
};

export const FactsScreen = ({bottomInset}: FactsScreenProps) => {
  const [sportId, setSportId] = useState<SportId>('football');
  const [randomFact, setRandomFact] = useState<
    (Fact & {sportId: SportId}) | null
  >(null);
  const activeFacts =
    facts.find(group => group.sportId === sportId)?.facts ?? [];
  const activeSport = getSportById(sportId);

  const random = () => {
    setRandomFact(allFacts[Math.floor(Math.random() * allFacts.length)]);
  };

  const shareFact = (fact: Fact) => {
    Share.share({
      message: `${fact.title}\n\n${fact.body}`,
    }).catch(() => {});
  };

  const randomSport = useMemo(
    () => (randomFact ? getSportById(randomFact.sportId) : null),
    [randomFact],
  );

  return (
    <TabScrollView bottomInset={bottomInset}>
      <ScreenHeader
        eyebrow="KNOWLEDGE HUB"
        title="Interesting Facts"
        right={<StreakPill />}
      />
      <Pressable onPress={random} style={styles.randomButton}>
        <Text style={styles.randomText}>🔀 Random Fact</Text>
        <Text style={styles.randomArrow}>›</Text>
      </Pressable>

      {randomFact && randomSport ? (
        <View style={styles.randomCard}>
          <View style={styles.randomHeader}>
            <Text style={styles.randomHeaderText}>
              {randomSport.emoji} ✨ Random Fact
            </Text>
            <Pressable onPress={() => setRandomFact(null)}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.factTitle}>{randomFact.title}</Text>
          <Text style={styles.factBody}>{randomFact.body}</Text>
          <ShareButton onPress={() => shareFact(randomFact)} />
        </View>
      ) : null}

      <View style={styles.filters}>
        {sports.map(sport => (
          <Pressable
            key={sport.id}
            onPress={() => setSportId(sport.id)}
            style={[
              styles.filterChip,
              sportId === sport.id && styles.filterChipActive,
              sportId === sport.id && {borderColor: sport.color},
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.filterText,
                sportId === sport.id && {color: sport.accent},
              ]}>
              {sport.emoji} {sport.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionEmoji}>{activeSport.emoji}</Text>
        <View>
          <Text style={styles.sectionTitle}>{activeSport.name} Facts</Text>
          <Text style={styles.sectionSubtitle}>
            {activeFacts.length} facts available
          </Text>
        </View>
      </View>

      <View style={styles.factList}>
        {activeFacts.map(fact => (
          <View key={fact.title} style={styles.factCard}>
            <Text style={styles.factCardWatermark}>{activeSport.emoji}</Text>
            <View style={styles.factTitleRow}>
              <View style={[styles.factDot, {backgroundColor: activeSport.accent}]} />
              <Text style={styles.factTitle}>{fact.title}</Text>
            </View>
            <Text style={styles.factBody}>{fact.body}</Text>
            <ShareButton onPress={() => shareFact(fact)} />
          </View>
        ))}
      </View>
    </TabScrollView>
  );
};

const ShareButton = ({onPress}: {onPress: () => void}) => (
  <Pressable onPress={onPress} style={styles.shareButton}>
    <Text style={styles.shareText}>📤 Share</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  randomButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  randomText: {
    color: colors.yellow,
    fontSize: 16,
    fontWeight: '900',
  },
  randomArrow: {
    color: colors.yellow,
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '900',
  },
  randomCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.yellow,
    backgroundColor: colors.card,
    padding: 18,
    marginTop: 14,
  },
  randomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  randomHeaderText: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '900',
  },
  closeText: {
    color: colors.muted,
    fontSize: 20,
    fontWeight: '900',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  filterChip: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  filterChipActive: {
    backgroundColor: 'rgba(36, 192, 90, 0.08)',
  },
  filterText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionEmoji: {
    fontSize: 28,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  factList: {
    gap: 12,
  },
  factCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: 18,
    overflow: 'hidden',
  },
  factCardWatermark: {
    position: 'absolute',
    right: 10,
    top: 2,
    fontSize: 64,
    opacity: 0.05,
  },
  factTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  factDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  factTitle: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '900',
  },
  factBody: {
    color: colors.mutedStrong,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    marginTop: 12,
  },
  shareButton: {
    alignSelf: 'flex-start',
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 16,
  },
  shareText: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '900',
  },
});
