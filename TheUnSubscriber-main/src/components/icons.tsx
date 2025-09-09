import {
    Clapperboard,
    Music,
    Tv,
    Gamepad2,
    Newspaper,
    Dumbbell,
    Wallet,
    ShoppingBag,
    Cloud,
    BookOpen
  } from 'lucide-react';
  import type { LucideIcon } from 'lucide-react';
  
  export const subscriptionIcons: { [key: string]: LucideIcon } = {
    default: Wallet,
    netflix: Clapperboard,
    spotify: Music,
    hulu: Tv,
    'hbo max': Tv,
    'disney+': Tv,
    'youtube premium': Tv,
    'xbox': Gamepad2,
    'playstation': Gamepad2,
    'nintendo': Gamepad2,
    'new york times': Newspaper,
    'wall street journal': Newspaper,
    gym: Dumbbell,
    'peloton': Dumbbell,
    'amazon': ShoppingBag,
    'icloud': Cloud,
    'google drive': Cloud,
    'dropbox': Cloud,
    'audible': BookOpen,
  };
  
  export function getSubscriptionIcon(name: string): LucideIcon {
    const lowerCaseName = name.toLowerCase();
    for (const key in subscriptionIcons) {
      if (lowerCaseName.includes(key)) {
        return subscriptionIcons[key];
      }
    }
    return subscriptionIcons.default;
  };
  