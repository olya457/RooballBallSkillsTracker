import React from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScreenHeader} from '../components/ScreenHeader';
import {StreakPill} from '../components/StreakPill';
import {TabScrollView} from '../components/TabScrollView';
import {wallpapers} from '../data/wallpapers';
import {useAppState} from '../state/AppState';
import {colors} from '../styles/theme';
import type {Wallpaper} from '../types/app';

type CollectionScreenProps = {
  bottomInset: number;
};

export const CollectionScreen = ({bottomInset}: CollectionScreenProps) => {
  const {data, unlockWallpaper, selectWallpaper} = useAppState();
  const unlockedCount = data.unlockedWallpaperIds.length;

  const handleWallpaperPress = (wallpaper: Wallpaper) => {
    const unlocked = data.unlockedWallpaperIds.includes(wallpaper.id);

    if (unlocked) {
      selectWallpaper(wallpaper.id);
      return;
    }

    if (data.cups < wallpaper.cost) {
      Alert.alert('Not enough cups', 'Play the reaction game to earn more cups.');
      return;
    }

    unlockWallpaper(wallpaper);
  };

  return (
    <TabScrollView bottomInset={bottomInset}>
      <ScreenHeader
        eyebrow="YOUR COLLECTION"
        title="Wallpapers"
        right={
          <View style={styles.headerRight}>
            <StreakPill />
            <View style={styles.cupsPill}>
              <Text style={styles.cupsText}>🏆 {data.cups} cups</Text>
            </View>
          </View>
        }
      />
      <Text style={styles.unlockText}>
        {unlockedCount}/{wallpapers.length} unlocked
      </Text>
      <View style={styles.grid}>
        {wallpapers.map((wallpaper, index) => {
          const unlocked = data.unlockedWallpaperIds.includes(wallpaper.id);
          const active = data.activeWallpaperId === wallpaper.id;

          return (
            <Pressable
              key={wallpaper.id}
              onPress={() => handleWallpaperPress(wallpaper)}
              style={styles.wallpaperCell}>
              <ImageBackground
                source={wallpaper.source}
                resizeMode="cover"
                style={styles.wallpaper}
                imageStyle={styles.wallpaperImage}>
                <View style={[styles.dim, unlocked && styles.dimUnlocked]} />
                {active ? (
                  <View style={styles.activeCheck}>
                    <Text style={styles.activeCheckText}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.lock}>
                    <Text style={styles.lockText}>{unlocked ? '✅' : '🔒'}</Text>
                  </View>
                )}
                {unlocked ? (
                  <Text style={styles.collectionLabel}>
                    {active ? 'Selected' : 'Tap to select'}
                  </Text>
                ) : null}
                {!unlocked ? (
                  <Text style={styles.cost}>🏆 {wallpaper.cost} cups</Text>
                ) : (
                  <Text style={styles.cost}>#{index + 1}</Text>
                )}
              </ImageBackground>
            </Pressable>
          );
        })}
      </View>
    </TabScrollView>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  cupsPill: {
    minHeight: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.yellow,
    backgroundColor: colors.yellowSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  cupsText: {
    color: colors.yellow,
    fontSize: 14,
    fontWeight: '900',
  },
  unlockText: {
    color: colors.muted,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 18,
  },
  wallpaperCell: {
    width: '48%',
    minWidth: 145,
    flexGrow: 1,
    aspectRatio: 0.74,
  },
  wallpaper: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  wallpaperImage: {
    borderRadius: 18,
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  dimUnlocked: {
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  lock: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  activeCheck: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.greenDark,
    borderWidth: 1,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCheckText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  collectionLabel: {
    alignSelf: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.card,
    color: colors.yellow,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 34,
  },
  cost: {
    color: colors.yellow,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 14,
  },
});
