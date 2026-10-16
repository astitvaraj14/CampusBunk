import { StyleSheet, useColorScheme } from 'react-native';

// Status colors remain the same across themes to maintain meaning
export const StatusColors = {
  amber: '#E8A33D',
  moss: '#6E8F72',
  clay: '#C1524A',
};

// Define Light and Dark palettes
export const ThemeColors = {
  light: {
    background: '#F7F4EE', // paper
    surface: '#FFFFFF',    // paperCard
    surfaceBlur: 'rgba(255, 255, 255, 0.7)',
    text: '#14171C',       // ink
    textSoft: '#7A7E88',   // inkSoft
    border: '#E8E5DF',     // line
    accent: '#E8A33D',
    ...StatusColors,
  },
  dark: {
    background: '#0F1115', // slightly deeper than ink for OLED/modern dark
    surface: '#1E2229',    // panel
    surfaceBlur: 'rgba(30, 34, 41, 0.7)',
    text: '#F7F4EE',       // paper
    textSoft: '#A0A4AB',   // paperSoft
    border: '#2C3038',     // dark mode line
    accent: '#E8A33D',
    ...StatusColors,
  }
};

export type ThemeColorsType = typeof ThemeColors.light;

export function useTheme(): ThemeColorsType {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? ThemeColors.dark : ThemeColors.light;
}

export const Typography = StyleSheet.create({
  hero: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 48,
    letterSpacing: -1,
  },
  sectionNumber: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 28,
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },
  monoData: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 14,
  },
});

export const Layout = {
  padding: 20,
  cardPadding: 20,
  cardRadius: 20,
  pillRadius: 999,
  gap: 16,
};

// Static shadows for things that need them (though we'll use blurs more now)
export const Shadows = StyleSheet.create({
  lightSm: {
    shadowColor: '#14171C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lightMd: {
    shadowColor: '#14171C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  darkMd: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  amberGlow: {
    shadowColor: '#E8A33D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  }
});
