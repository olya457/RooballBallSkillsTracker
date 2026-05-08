import React, {useEffect, useMemo, useState} from 'react';
import {InteractionManager, StatusBar, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FloatingTabBar} from '../components/FloatingTabBar';
import {CollectionScreen} from './CollectionScreen';
import {FactsScreen} from './FactsScreen';
import {GameScreen} from './GameScreen';
import {HistoryScreen} from './HistoryScreen';
import {TrackerScreen} from './TrackerScreen';
import {
  colors,
  getBottomGap,
  getTopGap,
  gradients,
  layout,
} from '../styles/theme';
import type {TabId} from '../types/app';

export const MainTabs = () => {
  const [activeTab, setActiveTab] = useState<TabId>('tracker');
  const [mountedTabs, setMountedTabs] = useState<Set<TabId>>(
    () => new Set(['tracker', 'history', 'collection']),
  );
  const insets = useSafeAreaInsets();
  const bottomGap = getBottomGap(insets.bottom);
  const topGap = getTopGap(insets.top);
  const tabs = useMemo(
    () =>
      [
        {
          id: 'tracker' as const,
          node: <TrackerScreen bottomInset={bottomGap} />,
        },
        {
          id: 'history' as const,
          node: <HistoryScreen bottomInset={bottomGap} goToTab={setActiveTab} />,
        },
        {
          id: 'facts' as const,
          node: <FactsScreen bottomInset={bottomGap} />,
        },
        {
          id: 'game' as const,
          node: <GameScreen bottomInset={bottomGap} />,
        },
        {
          id: 'collection' as const,
          node: <CollectionScreen bottomInset={bottomGap} />,
        },
      ],
    [bottomGap],
  );

  useEffect(() => {
    setMountedTabs(current => {
      if (current.has(activeTab)) {
        return current;
      }

      const next = new Set(current);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setMountedTabs(new Set(['tracker', 'history', 'facts', 'game', 'collection']));
    });

    return () => task.cancel();
  }, []);

  return (
    <LinearGradient colors={gradients.app} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.content}>
        {tabs.map(tab =>
          mountedTabs.has(tab.id) ? (
            <View
              key={tab.id}
              pointerEvents={activeTab === tab.id ? 'auto' : 'none'}
              style={[
                styles.tabPane,
                {
                  paddingTop: topGap,
                  bottom: bottomGap + layout.tabHeight + 12,
                },
                activeTab === tab.id
                  ? styles.visibleTabPane
                  : styles.hiddenTabPane,
              ]}>
              {tab.node}
            </View>
          ) : null,
        )}
      </View>
      <FloatingTabBar
        activeTab={activeTab}
        onChange={setActiveTab}
        bottom={bottomGap}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabPane: {
    ...StyleSheet.absoluteFillObject,
  },
  visibleTabPane: {
    opacity: 1,
    zIndex: 1,
  },
  hiddenTabPane: {
    opacity: 0,
    zIndex: 0,
  },
});
