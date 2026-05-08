import type {Sport} from '../types/app';

export const sports: Sport[] = [
  {
    id: 'football',
    name: 'Football',
    emoji: '⚽',
    description: 'The beautiful game',
    color: '#23852B',
    accent: '#3DD15A',
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    emoji: '🏐',
    description: 'Sky high intensity',
    color: '#B87800',
    accent: '#FDB62B',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    emoji: '🏀',
    description: 'Court dominance',
    color: '#C74200',
    accent: '#FF7A18',
  },
  {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    description: 'Precision & power',
    color: '#5F8B13',
    accent: '#C9F12E',
  },
  {
    id: 'handball',
    name: 'Handball',
    emoji: '🤾',
    description: 'Fast-paced action',
    color: '#7A1C99',
    accent: '#CC54F1',
  },
];

export const getSportById = (id: Sport['id']) =>
  sports.find(sport => sport.id === id) ?? sports[0];
