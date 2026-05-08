import type {ImageSourcePropType} from 'react-native';

export type SportId =
  | 'football'
  | 'volleyball'
  | 'basketball'
  | 'tennis'
  | 'handball';

export type TabId = 'tracker' | 'history' | 'facts' | 'game' | 'collection';

export type Sport = {
  id: SportId;
  name: string;
  emoji: string;
  description: string;
  color: string;
  accent: string;
};

export type Fact = {
  title: string;
  body: string;
};

export type SportFacts = {
  sportId: SportId;
  facts: Fact[];
};

export type OnboardingSlide = {
  eyebrow: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
  accent: string;
};

export type Wallpaper = {
  id: string;
  source: ImageSourcePropType;
  cost: number;
};

export type SessionRecord = {
  id: string;
  sportId: SportId;
  name: string;
  description: string;
  durationMinutes: number;
  elapsedSeconds: number;
  completedAt: string;
};

export type AppData = {
  hasSeenOnboarding: boolean;
  hasAcceptedDisclaimer: boolean;
  sessions: SessionRecord[];
  cups: number;
  unlockedWallpaperIds: string[];
  activeWallpaperId?: string;
};
