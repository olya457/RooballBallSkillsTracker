import {Platform} from 'react-native';

export const colors = {
  bg: '#08091B',
  bgSoft: '#11102B',
  header: '#1B1840',
  card: '#181639',
  cardAlt: '#1F1C49',
  border: '#34305F',
  borderWarm: '#6D4517',
  text: '#FFFFFF',
  muted: '#8F8AA8',
  mutedStrong: '#B8B4CA',
  yellow: '#FFD400',
  yellowSoft: '#3A3211',
  green: '#24C05A',
  greenDark: '#1F7B2B',
  red: '#EF3B3B',
  orange: '#FF9B11',
  blue: '#2C8CFF',
  purple: '#8B3DD9',
};

export const gradients = {
  app: ['#08091B', '#11102E', '#08091B'],
  panel: ['#211C4A', '#151331'],
  yellow: ['#FFD000', '#FFE05C'],
  green: ['#23852B', '#2DA338'],
  danger: ['#2C1023', '#3B1424'],
};

export const shadow = Platform.select({
  ios: {
    shadowColor: '#FFD400',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
  },
  android: {
    elevation: 10,
  },
});

export const layout = {
  horizontal: 20,
  tabHeight: 74,
};

export const androidInset = 30;

export const getBottomGap = (_safeBottom: number) =>
  Platform.OS === 'android' ? androidInset : 20;

export const getTopGap = (safeTop: number) =>
  Platform.OS === 'android' ? androidInset : Math.max(safeTop, 12);
