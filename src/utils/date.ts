export const dayKey = (date: Date) => date.toISOString().slice(0, 10);

export const formatSessionDate = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (dayKey(date) === dayKey(today)) {
    return 'Today';
  }

  if (dayKey(date) === dayKey(yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
};

export const formatClock = (seconds: number) => {
  const minutes = Math.floor(Math.max(seconds, 0) / 60);
  const rest = Math.max(seconds, 0) % 60;

  return `${minutes}:${rest.toString().padStart(2, '0')}`;
};

export const formatTotalTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

export const getRecentDays = () =>
  Array.from({length: 7}, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      key: dayKey(date),
      label: date.toLocaleDateString(undefined, {weekday: 'short'}).slice(0, 3),
    };
  });
