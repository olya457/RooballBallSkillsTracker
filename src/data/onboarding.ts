import {images} from '../assets';
import type {OnboardingSlide} from '../types/app';

export const onboardingSlides: OnboardingSlide[] = [
  {
    eyebrow: 'YOUR BALL SPORTS COMPANION',
    title: "Hey, I'm Roo!",
    body: "Welcome to BallsUp! I'm Roo, and I'll be your guide on this epic sports journey. Whether you kick, spike, dunk, smash, or throw — this app is built for you!",
    image: images.rooFront,
    accent: '#FFD400',
  },
  {
    eyebrow: 'SET. TIMER. GO.',
    title: 'Track Every Session',
    body: "Choose your ball sport, name your workout, set the timer, and let's go! I'll keep you pumped with motivational tips while you train. No session goes unrecorded!",
    image: images.rooPointing,
    accent: '#39CB5F',
  },
  {
    eyebrow: 'EVERY REP COUNTS',
    title: 'Your Activity History',
    body: 'Track your progress over time! See all your past sessions organized by sport category. Building habits is easier when you can see your journey laid out in front of you.',
    image: images.rooCrossed,
    accent: '#2C8CFF',
  },
  {
    eyebrow: 'REACTION MINI-GAME',
    title: 'Play & Earn Cups',
    body: 'Test your reflexes in the reaction game! Pick your favorite ball, smash falling targets before time runs out, and earn 🏆 cups. Beat the goal — earn 4 cups. Don’t? Still get 2!',
    image: images.rooPresenting,
    accent: '#FF9B11',
  },
  {
    eyebrow: 'UNLOCK & PERSONALIZE',
    title: 'Build Your Collection',
    body: 'Spend your hard-earned cups on stunning sports wallpapers! Download them, set them as your phone background, or share with friends. Your cups, your collection!',
    image: images.rooThumbsUp,
    accent: '#C547E8',
  },
];
