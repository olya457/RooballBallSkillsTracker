import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {AppData, SessionRecord, Wallpaper} from '../types/app';

const STORAGE_KEY = 'rooball:app-state:v1';

const defaultData: AppData = {
  hasSeenOnboarding: false,
  hasAcceptedDisclaimer: false,
  sessions: [],
  cups: 10,
  unlockedWallpaperIds: [],
};

type AppStateContextValue = {
  data: AppData;
  hydrated: boolean;
  completeOnboarding: () => void;
  acceptDisclaimer: () => void;
  addSession: (session: SessionRecord) => void;
  deleteSession: (sessionId: string) => void;
  addCups: (amount: number) => void;
  unlockWallpaper: (wallpaper: Wallpaper) => void;
  selectWallpaper: (wallpaperId: string) => void;
};

const AppStateContext = createContext<AppStateContextValue | undefined>(
  undefined,
);

const cleanData = (value: Partial<AppData> | null): AppData => {
  const safeValue = value ?? {};

  return {
    ...defaultData,
    ...safeValue,
    sessions: Array.isArray(safeValue.sessions) ? safeValue.sessions : [],
    cups:
      typeof safeValue.cups === 'number' ? safeValue.cups : defaultData.cups,
    unlockedWallpaperIds: Array.isArray(safeValue.unlockedWallpaperIds)
      ? safeValue.unlockedWallpaperIds
      : [],
  };
};

export const AppStateProvider = ({children}: {children: React.ReactNode}) => {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (stored) {
          setData(cleanData(JSON.parse(stored)));
        }
      })
      .catch(() => {
        setData(defaultData);
      })
      .finally(() => {
        setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    }
  }, [data, hydrated]);

  const updateData = useCallback((updater: (current: AppData) => AppData) => {
    setData(current => updater(current));
  }, []);

  const completeOnboarding = useCallback(() => {
    updateData(current => ({...current, hasSeenOnboarding: true}));
  }, [updateData]);

  const acceptDisclaimer = useCallback(() => {
    updateData(current => ({...current, hasAcceptedDisclaimer: true}));
  }, [updateData]);

  const addSession = useCallback(
    (session: SessionRecord) => {
      updateData(current => ({
        ...current,
        sessions: [session, ...current.sessions],
      }));
    },
    [updateData],
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      updateData(current => ({
        ...current,
        sessions: current.sessions.filter(session => session.id !== sessionId),
      }));
    },
    [updateData],
  );

  const addCups = useCallback(
    (amount: number) => {
      updateData(current => ({...current, cups: current.cups + amount}));
    },
    [updateData],
  );

  const unlockWallpaper = useCallback(
    (wallpaper: Wallpaper) => {
      updateData(current => {
        if (current.unlockedWallpaperIds.includes(wallpaper.id)) {
          return current;
        }

        if (current.cups < wallpaper.cost) {
          return current;
        }

        return {
          ...current,
          cups: current.cups - wallpaper.cost,
          unlockedWallpaperIds: [
            ...current.unlockedWallpaperIds,
            wallpaper.id,
          ],
          activeWallpaperId: wallpaper.id,
        };
      });
    },
    [updateData],
  );

  const selectWallpaper = useCallback(
    (wallpaperId: string) => {
      updateData(current => {
        if (!current.unlockedWallpaperIds.includes(wallpaperId)) {
          return current;
        }

        return {...current, activeWallpaperId: wallpaperId};
      });
    },
    [updateData],
  );

  const value = useMemo(
    () => ({
      data,
      hydrated,
      completeOnboarding,
      acceptDisclaimer,
      addSession,
      deleteSession,
      addCups,
      unlockWallpaper,
      selectWallpaper,
    }),
    [
      data,
      hydrated,
      completeOnboarding,
      acceptDisclaimer,
      addSession,
      deleteSession,
      addCups,
      unlockWallpaper,
      selectWallpaper,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }

  return context;
};
