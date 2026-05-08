import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../assets';
import {CompactKeyboard} from '../components/CompactKeyboard';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenHeader} from '../components/ScreenHeader';
import {StreakPill} from '../components/StreakPill';
import {TabScrollView} from '../components/TabScrollView';
import {motivationTips} from '../data/motivation';
import {getSportById, sports} from '../data/sports';
import {useAppState} from '../state/AppState';
import {colors, gradients, layout} from '../styles/theme';
import type {SessionRecord, Sport, SportId} from '../types/app';
import {formatClock} from '../utils/date';

type TrackerScreenProps = {
  bottomInset: number;
};

type TrackerMode = 'choose' | 'setup' | 'timer' | 'complete';
type ActiveInput = 'name' | 'description' | null;

const durations = [15, 30, 45, 60];

const makeSessionId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const TrackerScreen = ({bottomInset}: TrackerScreenProps) => {
  const {addSession} = useAppState();
  const {height} = useWindowDimensions();
  const [mode, setMode] = useState<TrackerMode>('choose');
  const [sportId, setSportId] = useState<SportId>('football');
  const [sessionName, setSessionName] = useState('');
  const [description, setDescription] = useState('');
  const [activeInput, setActiveInput] = useState<ActiveInput>(null);
  const [duration, setDuration] = useState(30);
  const [remaining, setRemaining] = useState(duration * 60);
  const [paused, setPaused] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [completedSession, setCompletedSession] = useState<SessionRecord | null>(
    null,
  );
  const savedRef = useRef(false);
  const wasPausedBeforeEndPrompt = useRef(false);
  const nameInputRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const descriptionInputRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const sport = getSportById(sportId);
  const compact = height < 730;
  const tip = useMemo(
    () => motivationTips[Math.floor(Math.random() * motivationTips.length)],
    [],
  );

  const openSetup = (nextSportId: SportId) => {
    setSportId(nextSportId);
    setSessionName('');
    setDescription('');
    setActiveInput(null);
    setDuration(30);
    setMode('setup');
  };

  const updateActiveText = useCallback(
    (updater: (current: string) => string) => {
      if (activeInput === 'name') {
        setSessionName(current => updater(current).slice(0, 42));
      }

      if (activeInput === 'description') {
        setDescription(current => updater(current).slice(0, 120));
      }
    },
    [activeInput],
  );

  const closeKeyboard = useCallback(() => {
    setActiveInput(null);
    nameInputRef.current?.blur();
    descriptionInputRef.current?.blur();
  }, []);

  const openEndPrompt = useCallback(() => {
    wasPausedBeforeEndPrompt.current = paused;
    setPaused(true);
    setShowEndModal(true);
  }, [paused]);

  const keepGoing = useCallback(() => {
    setShowEndModal(false);
    setPaused(wasPausedBeforeEndPrompt.current);
  }, []);

  const startTimer = () => {
    savedRef.current = false;
    setRemaining(duration * 60);
    setPaused(false);
    setShowEndModal(false);
    setMode('timer');
  };

  const finishTimer = useCallback((elapsedSeconds: number) => {
    if (savedRef.current) {
      return;
    }

    savedRef.current = true;

    const session: SessionRecord = {
      id: makeSessionId(),
      sportId,
      name: sessionName.trim() || 'Unnamed Session',
      description: description.trim(),
      durationMinutes: duration,
      elapsedSeconds,
      completedAt: new Date().toISOString(),
    };

    addSession(session);
    setCompletedSession(session);
    setShowEndModal(false);
    setPaused(false);
    setMode('complete');
  }, [addSession, description, duration, sessionName, sportId]);

  useEffect(() => {
    if (mode !== 'timer' || paused) {
      return;
    }

    const interval = setInterval(() => {
      setRemaining(current => {
        if (current <= 1) {
          setTimeout(() => finishTimer(duration * 60), 0);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, finishTimer, mode, paused]);

  if (mode === 'setup') {
    return (
      <TabScrollView bottomInset={bottomInset}>
        <BackButton onPress={() => setMode('choose')} />
        <ScreenHeader
          eyebrow={`⚽ ${sport.name.toUpperCase()}`}
          title="Setup Session"
          right={<StreakPill />}
        />
        <View style={styles.form}>
          <InputLabel label="Session Name *" />
          <TextInput
            ref={nameInputRef}
            value={sessionName}
            onChangeText={setSessionName}
            onFocus={() => setActiveInput('name')}
            onPressIn={() => setActiveInput('name')}
            placeholder="e.g. Morning Drills"
            placeholderTextColor={colors.muted}
            showSoftInputOnFocus={false}
            maxLength={42}
            style={[
              styles.input,
              activeInput === 'name' && styles.inputActive,
            ]}
          />
          <InputLabel label="Short Description" />
          <TextInput
            ref={descriptionInputRef}
            value={description}
            onChangeText={setDescription}
            onFocus={() => setActiveInput('description')}
            onPressIn={() => setActiveInput('description')}
            placeholder="What will you be working on?"
            placeholderTextColor={colors.muted}
            multiline
            showSoftInputOnFocus={false}
            maxLength={120}
            style={[
              styles.input,
              styles.textArea,
              activeInput === 'description' && styles.inputActive,
            ]}
          />
          <CompactKeyboard
            visible={activeInput !== null}
            onKey={value => updateActiveText(current => `${current}${value}`)}
            onBackspace={() =>
              updateActiveText(current => current.slice(0, -1))
            }
            onSpace={() => updateActiveText(current => `${current} `)}
            onClear={() => updateActiveText(() => '')}
            onDone={closeKeyboard}
          />
          <InputLabel label="Session Duration" />
          <View style={styles.durationRow}>
            {durations.map(item => (
              <Pressable
                key={item}
                onPress={() => setDuration(item)}
                style={[
                  styles.durationChip,
                  item === duration && styles.durationChipActive,
                ]}>
                <Text
                  style={[
                    styles.durationText,
                    item === duration && styles.durationTextActive,
                  ]}>
                  {item}m
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.range}>
            <View style={styles.rangeLine} />
            <View
              style={[
                styles.rangeDot,
                {left: `${((duration - 15) / 45) * 100}%`},
              ]}
            />
            <View style={styles.rangeBadge}>
              <Text style={styles.rangeBadgeText}>{duration}m</Text>
            </View>
          </View>
          <LinearGradient colors={gradients.green} style={styles.summaryCard}>
            <Text style={styles.summaryEmoji}>{sport.emoji}</Text>
            <View style={styles.summaryTextWrap}>
              <Text style={styles.summaryTitle} numberOfLines={1}>
                {sessionName.trim() || 'Unnamed Session'}
              </Text>
              <Text style={styles.summarySub}>
                {duration} minutes · {sport.name}
              </Text>
            </View>
          </LinearGradient>
          <PrimaryButton
            label="Start Training"
            icon="▶️"
            onPress={startTimer}
            style={styles.startButton}
          />
        </View>
      </TabScrollView>
    );
  }

  if (mode === 'timer') {
    const progress = remaining / (duration * 60);
    const elapsedSeconds = duration * 60 - remaining;

    return (
      <View
        style={[
          styles.timerRoot,
          {paddingBottom: bottomInset + layout.tabHeight + 24},
        ]}>
        <BackButton onPress={openEndPrompt} />
        <Text style={styles.timerSessionName} numberOfLines={1}>
          {sessionName.trim() || 'Unnamed Session'}
        </Text>
        <Text style={styles.timerSport}>{sport.name}</Text>
        <View style={styles.timerCircleWrap}>
          <View style={styles.timerGlow} />
          <View style={styles.timerCircle}>
            <View
              style={[
                styles.timerSegment,
                {
                  transform: [{rotate: `${progress * 290}deg`}],
                  borderColor: paused ? colors.yellow : sport.accent,
                },
              ]}
            />
            <Text style={styles.timerClock}>{formatClock(remaining)}</Text>
            <Text style={styles.timerStatus}>
              {paused ? '▣ Paused' : '● Live'}
            </Text>
            <Text style={styles.timerBall}>{sport.emoji}</Text>
          </View>
        </View>
        <View style={styles.coachCard}>
          <Text style={styles.coachTitle}>💬 COACH ROO SAYS</Text>
          <Text style={styles.coachText}>{tip}</Text>
        </View>
        <View style={styles.timerActions}>
          <PrimaryButton
            label={paused ? 'Resume' : 'Pause'}
            icon={paused ? '▶️' : '⏸'}
            variant="ghost"
            onPress={() => setPaused(current => !current)}
            style={styles.timerMainButton}
          />
          <Pressable
            onPress={openEndPrompt}
            style={styles.stopButton}>
            <Text style={styles.stopText}>⏹</Text>
          </Pressable>
        </View>
        <Modal transparent visible={showEndModal} animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalIcon}>⚠</Text>
              <Text style={styles.modalTitle}>End session early?</Text>
              <Text style={styles.modalText}>
                Your progress will be saved.
              </Text>
              <View style={styles.modalActions}>
                <PrimaryButton
                  label="Keep Going"
                  variant="ghost"
                  onPress={keepGoing}
                  style={styles.modalButton}
                />
                <PrimaryButton
                  label="End Session"
                  variant="danger"
                  onPress={() => finishTimer(Math.max(elapsedSeconds, 1))}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (mode === 'complete' && completedSession) {
    const completedSport = getSportById(completedSession.sportId);

    return (
      <TabScrollView
        bottomInset={bottomInset}
        contentContainerStyle={styles.completeContent}>
        <View style={styles.completeHero}>
          <View style={styles.completeRing}>
            <Image source={images.rooThumbsUp} style={styles.completeRoo} />
          </View>
        </View>
        <Text style={styles.completeTitle}>Session Complete!</Text>
        <Text style={styles.completeSubtitle}>
          Great work on your {completedSport.name.toLowerCase()} training!
        </Text>
        <View style={styles.completeCard}>
          <InfoRow label="Sport" value={`${completedSport.emoji} ${completedSport.name}`} />
          <InfoRow label="Session" value={completedSession.name} />
          <InfoRow
            label="Duration"
            value={`${Math.max(
              1,
              Math.round(completedSession.elapsedSeconds / 60),
            )} min`}
          />
        </View>
        <PrimaryButton
          label="Done"
          icon="✓"
          onPress={() => setMode('choose')}
          style={styles.doneButton}
        />
      </TabScrollView>
    );
  }

  return (
    <TabScrollView bottomInset={bottomInset}>
      <ScreenHeader
        eyebrow="READY TO TRAIN?"
        title="Choose Your Sport"
        right={<StreakPill />}
      />
      <View style={[styles.sportGrid, compact && styles.sportGridCompact]}>
        {sports.map(item => (
          <SportCard
            key={item.id}
            sport={item}
            onPress={() => openSetup(item.id)}
          />
        ))}
      </View>
    </TabScrollView>
  );
};

const BackButton = ({onPress}: {onPress: () => void}) => (
  <Pressable onPress={onPress} style={styles.backButton}>
    <Text style={styles.backText}>‹</Text>
  </Pressable>
);

const InputLabel = ({label}: {label: string}) => (
  <Text style={styles.inputLabel}>⌁ {label}</Text>
);

const SportCard = ({sport, onPress}: {sport: Sport; onPress: () => void}) => (
  <Pressable onPress={onPress} style={styles.sportCardWrap}>
    <LinearGradient
      colors={[sport.color, sport.color]}
      style={styles.sportCard}>
      <Text style={styles.sportEmoji}>{sport.emoji}</Text>
      <Text style={styles.sportName}>{sport.name}</Text>
      <Text style={styles.sportDescription}>{sport.description}</Text>
      <Text style={styles.sportStart}>▶️ Start session</Text>
      <Text style={styles.sportWatermark}>{sport.emoji}</Text>
    </LinearGradient>
  </Pressable>
);

const InfoRow = ({label, value}: {label: string; value: string}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
  },
  sportGridCompact: {
    gap: 10,
  },
  sportCardWrap: {
    width: '48%',
    minWidth: 140,
    flexGrow: 1,
  },
  sportCard: {
    minHeight: 128,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  sportEmoji: {
    fontSize: 28,
    marginBottom: 16,
  },
  sportName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  sportDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '700',
  },
  sportStart: {
    color: 'rgba(255,212,0,0.9)',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 12,
  },
  sportWatermark: {
    position: 'absolute',
    right: -4,
    top: -2,
    fontSize: 56,
    opacity: 0.14,
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
  form: {
    gap: 12,
    marginTop: 16,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  input: {
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#423B7A',
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
  },
  inputActive: {
    borderColor: colors.yellow,
    backgroundColor: '#1D193D',
  },
  textArea: {
    minHeight: 86,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },
  durationChip: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationChipActive: {
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
  },
  durationText: {
    color: colors.muted,
    fontWeight: '900',
    fontSize: 12,
  },
  durationTextActive: {
    color: colors.yellow,
  },
  range: {
    height: 42,
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  rangeLine: {
    height: 3,
    backgroundColor: '#302D52',
    borderRadius: 2,
  },
  rangeDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.yellow,
    marginLeft: -8,
  },
  rangeBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 12,
    backgroundColor: colors.yellowSoft,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  rangeBadgeText: {
    color: colors.yellow,
    fontSize: 12,
    fontWeight: '900',
  },
  summaryCard: {
    minHeight: 66,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  summaryEmoji: {
    fontSize: 34,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  summarySub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  startButton: {
    marginTop: 6,
  },
  timerRoot: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  timerSessionName: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '900',
    marginTop: -42,
  },
  timerSport: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  timerCircleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  timerGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(36, 192, 90, 0.12)',
  },
  timerCircle: {
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerSegment: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerClock: {
    color: colors.text,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
  },
  timerStatus: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  timerBall: {
    fontSize: 28,
    marginTop: 12,
  },
  coachCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#34305F',
    backgroundColor: colors.card,
    padding: 16,
    marginBottom: 18,
  },
  coachTitle: {
    color: colors.yellow,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 8,
  },
  coachText: {
    color: colors.mutedStrong,
    fontSize: 13,
    fontWeight: '700',
  },
  timerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerMainButton: {
    flex: 1,
  },
  stopButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7A2233',
    backgroundColor: '#271428',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopText: {
    color: colors.red,
    fontSize: 22,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 64,
    marginBottom: 10,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
  },
  modalText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 18,
  },
  modalActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  completeContent: {
    alignItems: 'center',
  },
  doneButton: {
    width: '100%',
    maxWidth: 360,
  },
  completeHero: {
    alignItems: 'center',
    marginTop: 8,
  },
  completeRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#6D2DC4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 18,
    borderColor: 'rgba(125, 46, 201, 0.58)',
  },
  completeRoo: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
  },
  completeTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 26,
    textAlign: 'center',
  },
  completeSubtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '700',
  },
  completeCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.card,
    padding: 18,
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  infoValue: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    textAlign: 'right',
    fontWeight: '900',
  },
});
