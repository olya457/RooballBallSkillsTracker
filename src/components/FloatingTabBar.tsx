import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, layout} from '../styles/theme';
import type {TabId} from '../types/app';

type FloatingTabBarProps = {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
  bottom: number;
};

const tabs: {id: TabId; label: string; icon: string}[] = [
  {id: 'tracker', label: 'Tracker', icon: '⏱'},
  {id: 'history', label: 'History', icon: '↺'},
  {id: 'facts', label: 'Facts', icon: '💡'},
  {id: 'game', label: 'Game', icon: '🎮'},
  {id: 'collection', label: 'Collection', icon: '🖼'},
];

export const FloatingTabBar = ({
  activeTab,
  onChange,
  bottom,
}: FloatingTabBarProps) => (
  <View style={[styles.wrap, {bottom}]}>
    {tabs.map(tab => {
      const active = activeTab === tab.id;

      return (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          style={({pressed}) => [
            styles.item,
            pressed && styles.pressed,
          ]}>
          <View style={[styles.iconBox, active && styles.activeIconBox]}>
            <Text style={[styles.icon, active && styles.activeIcon]}>
              {tab.icon}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.label, active && styles.activeLabel]}>
            {tab.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 14,
    right: 14,
    height: layout.tabHeight,
    borderRadius: 24,
    backgroundColor: 'rgba(8, 9, 27, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 212, 0, 0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  pressed: {
    opacity: 0.75,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconBox: {
    backgroundColor: colors.yellowSoft,
    borderWidth: 1,
    borderColor: 'rgba(255, 212, 0, 0.35)',
  },
  icon: {
    fontSize: 19,
    color: colors.muted,
  },
  activeIcon: {
    color: colors.yellow,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  activeLabel: {
    color: colors.yellow,
  },
});
