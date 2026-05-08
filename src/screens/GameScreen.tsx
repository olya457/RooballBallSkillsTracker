import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenHeader} from '../components/ScreenHeader';
import {StreakPill} from '../components/StreakPill';
import {TabScrollView} from '../components/TabScrollView';
import {getSportById, sports} from '../data/sports';
import {useAppState} from '../state/AppState';
import {colors, layout} from '../styles/theme';
import type {SportId} from '../types/app';

type GameScreenProps = {
  bottomInset: number;
};

type GameMode = 'intro' | 'pick' | 'play' | 'result';

const goal = 10;
const gameSeconds = 30;
const targetSize = 58;

const getTargetLifetime = (level: number) =>
  Math.max(520, 1320 - (level - 1) * 130);

export const GameScreen = ({bottomInset}: GameScreenProps) => {
  const {addCups} = useAppState();
  const {width, height} = useWindowDimensions();
  const [mode, setMode] = useState<GameMode>('intro');
  const [sportId, setSportId] = useState<SportId>('football');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [resultLevel, setResultLevel] = useState(1);
  const [hits, setHits] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(gameSeconds);
  const [paused, setPaused] = useState(false);
  const [target, setTarget] = useState({x: 160, y: 160, id: 0});
  const [feedback, setFeedback] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const [cupsEarned, setCupsEarned] = useState(0);
  const activeRef = useRef(false);
  const sport = getSportById(sportId);
  const playHeight = Math.max(360, height - bottomInset - layout.tabHeight - 230);
  const targetLifetime = getTargetLifetime(currentLevel);

  const moveTarget = useCallback(() => {
    const maxX = Math.max(width - targetSize - 44, 20);
    const maxY = Math.max(playHeight - targetSize - 28, 20);
    setTarget(current => ({
      x: Math.floor(20 + Math.random() * (maxX - 20)),
      y: Math.floor(20 + Math.random() * (maxY - 20)),
      id: current.id + 1,
    }));
  }, [playHeight, width]);

  const finishGame = useCallback((finalHits: number) => {
    if (!activeRef.current) {
      return;
    }

    activeRef.current = false;
    const reward = finalHits >= goal ? 4 : 2;
    setResultLevel(currentLevel);
    setCupsEarned(reward);
    addCups(reward);
    setMode('result');
  }, [addCups, currentLevel]);

  const beginLevel = useCallback((levelNumber: number) => {
    activeRef.current = true;
    setCurrentLevel(levelNumber);
    setHits(0);
    setSecondsLeft(gameSeconds);
    setPaused(false);
    setFeedback(null);
    moveTarget();
    setMode('play');
  }, [moveTarget]);

  const startGame = useCallback(() => {
    beginLevel(currentLevel);
  }, [beginLevel, currentLevel]);

  const startNextLevel = useCallback(() => {
    beginLevel(resultLevel + 1);
  }, [beginLevel, resultLevel]);

  const leaveGame = useCallback(() => {
    activeRef.current = false;
    setPaused(false);
    setFeedback(null);
    setMode('intro');
  }, []);

  const hitTarget = useCallback(() => {
    if (mode !== 'play' || paused || !activeRef.current) {
      return;
    }

    const hitPosition = {
      x: target.x,
      y: target.y,
      id: Date.now(),
    };

    setFeedback(hitPosition);
    setHits(current => {
      const nextHits = current + 1;

      if (nextHits >= goal) {
        setTimeout(() => finishGame(nextHits), 0);
        return nextHits;
      }

      moveTarget();
      return nextHits;
    });
  }, [finishGame, mode, moveTarget, paused, target.x, target.y]);

  useEffect(() => {
    if (mode !== 'play' || paused) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(current => {
        if (current <= 1) {
          setTimeout(() => finishGame(hits), 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [finishGame, hits, mode, paused]);

  useEffect(() => {
    if (mode !== 'play' || paused) {
      return;
    }

    const timeout = setTimeout(() => {
      moveTarget();
    }, targetLifetime);

    return () => clearTimeout(timeout);
  }, [mode, moveTarget, paused, target.id, targetLifetime]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = setTimeout(() => {
      setFeedback(current => (current?.id === feedback.id ? null : current));
    }, 420);

    return () => clearTimeout(timeout);
  }, [feedback]);

  const progress = useMemo(() => {
    const score = Math.min(hits / goal, 1);
    const time = secondsLeft / gameSeconds;

    return {score, time};
  }, [hits, secondsLeft]);

  if (mode === 'pick') {
    return (
      <TabScrollView bottomInset={bottomInset}>
        <BackButton onPress={() => setMode('intro')} />
        <ScreenHeader
          eyebrow="REACTION GAME"
          title="Pick Your Ball"
          right={<StreakPill />}
        />
        <View style={styles.pickList}>
          {sports.map(item => {
            const active = item.id === sportId;

            return (
              <Pressable
                key={item.id}
                onPress={() => setSportId(item.id)}
                style={[
                  styles.pickCard,
                  active && {backgroundColor: item.color, borderColor: item.color},
                ]}>
                <Text style={styles.pickEmoji}>{item.emoji}</Text>
                <View style={styles.pickTextWrap}>
                  <Text style={styles.pickName}>{item.name}</Text>
                  <Text style={styles.pickDescription}>{item.description}</Text>
                </View>
                {active ? <Text style={styles.pickCheck}>✓</Text> : null}
              </Pressable>
            );
          })}
        </View>
        <PrimaryButton
          label="Start Game!"
          icon="⚡"
          onPress={startGame}
          style={styles.gameStart}
        />
      </TabScrollView>
    );
  }

  if (mode === 'play') {
    return (
      <View
        style={[
          styles.playRoot,
          {paddingBottom: bottomInset + layout.tabHeight + 12},
        ]}>
        <View style={styles.playHeader}>
          <Text style={styles.playScore}>SCORE{'\n'}{hits}/10</Text>
          <View style={styles.playSportPill}>
            <Text style={styles.playSportText}>
              {sport.emoji} {sport.name}
            </Text>
            <Text style={styles.playLevelText}>Level {currentLevel}</Text>
          </View>
          <Text style={styles.playTime}>TIME{'\n'}{secondsLeft}s</Text>
        </View>
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.scoreProgress,
                {width: `${progress.score * 100}%`},
              ]}
            />
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.timeProgress,
                {width: `${progress.time * 100}%`},
              ]}
            />
          </View>
        </View>
        <View style={[styles.playArea, {height: playHeight}]}>
          <Text style={styles.speedLabel}>
            Speed {Math.round(1000 / targetLifetime * 10) / 10}x
          </Text>
          <Pressable
            onPress={hitTarget}
            style={[
              styles.target,
              {
                left: target.x,
                top: target.y,
                backgroundColor: `${sport.color}66`,
                borderColor: sport.accent,
              },
            ]}>
            <Text style={styles.targetEmoji}>{sport.emoji}</Text>
          </Pressable>
          {feedback ? (
            <View
              pointerEvents="none"
              style={[
                styles.feedback,
                {
                  left: feedback.x + targetSize * 0.54,
                  top: feedback.y - 12,
                },
              ]}>
              <Text style={styles.feedbackText}>+1</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.playActions}>
          <Pressable onPress={leaveGame} style={styles.squareButton}>
            <Text style={styles.squareText}>←</Text>
          </Pressable>
          <Pressable
            onPress={() => setPaused(current => !current)}
            style={styles.squareButton}>
            <Text style={styles.squareText}>{paused ? '▶' : 'Ⅱ'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (mode === 'result') {
    const achieved = hits >= goal;

    return (
      <TabScrollView
        bottomInset={bottomInset}
        contentContainerStyle={styles.resultContent}>
        <Text style={styles.resultMedal}>{achieved ? '🏆' : '🥈'}</Text>
        <Text style={styles.resultTitle}>
          {achieved ? 'Goal Achieved!' : 'Good Effort!'}
        </Text>
        <Text style={styles.resultSubtitle}>
          Level {resultLevel} finished with {hits}/10 targets.{' '}
          {achieved ? 'Maximum cups earned.' : 'Keep practicing!'}
        </Text>
        <View style={styles.resultStats}>
          <ResultStat icon="🎯" value={String(hits)} label="Targets Hit" />
          <ResultStat icon="🏆" value={`+${cupsEarned}`} label="Cups Earned" active />
          <ResultStat icon="⚡" value={String(resultLevel)} label="Level" />
        </View>
        <PrimaryButton
          label="New Level"
          icon="▶️"
          onPress={startNextLevel}
          style={styles.shareGame}
        />
        <PrimaryButton
          label="Back"
          variant="ghost"
          onPress={() => setMode('intro')}
          style={styles.backGame}
        />
      </TabScrollView>
    );
  }

  return (
    <TabScrollView bottomInset={bottomInset}>
      <ScreenHeader
        eyebrow="REACTION GAME"
        title="Play & Earn Cups"
        right={<StreakPill />}
      />
      <View style={styles.gameHero}>
        <Text style={styles.gameHeroEmoji}>🎯</Text>
        <Text style={styles.gameHeroTitle}>Reaction Game</Text>
        <Text style={styles.gameHeroSubtitle}>Test your reflexes!</Text>
      </View>
      <Text style={styles.howTitle}>How to Play</Text>
      <View style={styles.instructions}>
        <Instruction
          icon="🎯"
          title="Pick your ball sport"
          body="Choose from 5 ball categories to set the theme."
        />
        <Instruction
          icon="⚡"
          title="Tap the targets"
          body="The ball jumps to random places — tap it before it moves."
        />
        <Instruction
          icon="🏆"
          title="Beat the goal"
          body="Hit 10 targets in 30 seconds to win 4 cups!"
        />
        <Instruction
          icon="🚀"
          title="Level up speed"
          body="Finish a level, see your result, then start the next faster level."
        />
      </View>
      <View style={styles.rewardRow}>
        <View style={[styles.rewardCard, styles.rewardCardActive]}>
          <Text style={styles.rewardIcon}>🏆</Text>
          <Text style={styles.rewardValue}>4 cups</Text>
          <Text style={styles.rewardLabel}>Beat the goal</Text>
        </View>
        <View style={styles.rewardCard}>
          <Text style={styles.rewardIcon}>🥈</Text>
          <Text style={styles.rewardValueMuted}>2 cups</Text>
          <Text style={styles.rewardLabel}>Participation</Text>
        </View>
      </View>
      <PrimaryButton
        label="Let's Play!"
        icon="🎮"
        onPress={() => setMode('pick')}
        style={styles.gameStart}
      />
    </TabScrollView>
  );
};

const BackButton = ({onPress}: {onPress: () => void}) => (
  <Pressable onPress={onPress} style={styles.backButton}>
    <Text style={styles.backText}>‹</Text>
  </Pressable>
);

const Instruction = ({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) => (
  <View style={styles.instruction}>
    <View style={styles.instructionIcon}>
      <Text style={styles.instructionEmoji}>{icon}</Text>
    </View>
    <View style={styles.instructionText}>
      <Text style={styles.instructionTitle}>{title}</Text>
      <Text style={styles.instructionBody}>{body}</Text>
    </View>
  </View>
);

const ResultStat = ({
  icon,
  value,
  label,
  active,
}: {
  icon: string;
  value: string;
  label: string;
  active?: boolean;
}) => (
  <View style={[styles.resultStat, active && styles.resultStatActive]}>
    <Text style={styles.resultStatIcon}>{icon}</Text>
    <Text style={styles.resultStatValue}>{value}</Text>
    <Text style={styles.resultStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  gameHero: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#4C3C88',
    backgroundColor: '#2A2158',
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 18,
    marginBottom: 22,
  },
  gameHeroEmoji: {
    fontSize: 42,
  },
  gameHeroTitle: {
    color: colors.yellow,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    marginTop: 10,
  },
  gameHeroSubtitle: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  howTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '900',
    marginBottom: 18,
  },
  instructions: {
    gap: 14,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  instructionIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionEmoji: {
    fontSize: 18,
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  instructionBody: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 3,
  },
  rewardRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  rewardCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    paddingVertical: 18,
  },
  rewardCardActive: {
    borderColor: colors.borderWarm,
    backgroundColor: 'rgba(255, 212, 0, 0.08)',
  },
  rewardIcon: {
    fontSize: 27,
  },
  rewardValue: {
    color: colors.yellow,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 10,
  },
  rewardValueMuted: {
    color: colors.mutedStrong,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 10,
  },
  rewardLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  gameStart: {
    marginTop: 16,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  backText: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
  },
  pickList: {
    gap: 10,
    marginTop: 18,
  },
  pickCard: {
    minHeight: 78,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 18,
  },
  pickEmoji: {
    fontSize: 38,
  },
  pickTextWrap: {
    flex: 1,
  },
  pickName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  pickDescription: {
    color: colors.mutedStrong,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  pickCheck: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  playRoot: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  playHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playScore: {
    color: colors.yellow,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '900',
  },
  playSportPill: {
    minWidth: 130,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  playSportText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  playLevelText: {
    color: colors.yellow,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 3,
  },
  playTime: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'right',
    fontWeight: '900',
  },
  progressWrap: {
    gap: 5,
    marginTop: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#302D52',
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: colors.yellow,
  },
  timeProgress: {
    height: '100%',
    backgroundColor: colors.green,
  },
  playArea: {
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
  },
  speedLabel: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  target: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.green,
    shadowOpacity: 0.48,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  targetEmoji: {
    fontSize: 31,
  },
  feedback: {
    position: 'absolute',
    minWidth: 42,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.yellow,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 0},
    elevation: 8,
  },
  feedbackText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: '900',
  },
  playActions: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 16,
  },
  squareButton: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareText: {
    color: colors.yellow,
    fontSize: 24,
    fontWeight: '900',
  },
  resultContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  resultMedal: {
    fontSize: 58,
    marginBottom: 20,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 32,
    textAlign: 'center',
    fontWeight: '900',
  },
  resultSubtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 12,
  },
  resultStats: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 28,
  },
  resultStat: {
    width: 96,
    minHeight: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  resultStatActive: {
    borderColor: colors.borderWarm,
    backgroundColor: 'rgba(255, 212, 0, 0.08)',
  },
  resultStatIcon: {
    fontSize: 19,
  },
  resultStatValue: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '900',
    marginTop: 8,
  },
  resultStatLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 5,
    textAlign: 'center',
  },
  shareGame: {
    alignSelf: 'stretch',
    marginTop: 28,
  },
  backGame: {
    alignSelf: 'stretch',
    marginTop: 14,
  },
});
