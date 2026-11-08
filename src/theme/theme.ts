/**
 * Material Design 3 theme tokens and tonal colors for Orbit Mobile
 */

export interface MD3Colors {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  secondaryContainer: string;
  surface: string;
  surfaceVariant: string;
  background: string;
  outline: string;
  outlineVariant: string;
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
  };
  tierS: string;
  tierA: string;
  tierB: string;
  tierC: string;
  tierD: string;
}

export const OrbitLightTheme: { colors: MD3Colors; roundness: number } = {
  colors: {
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    secondaryContainer: '#E8DEF8',
    surface: '#FEF7FF',
    surfaceVariant: '#E7E0EC',
    background: '#FEF7FF',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    elevation: {
      level0: 'transparent',
      level1: '#F7F2FA',
      level2: '#F3EDF7',
      level3: '#EFE7F4',
    },
    tierS: '#FF7F7F',
    tierA: '#FFBF7F',
    tierB: '#FFDF7F',
    tierC: '#FFFF7F',
    tierD: '#BFFF7F',
  },
  roundness: 20,
};

export const OrbitDarkTheme: { colors: MD3Colors; roundness: number } = {
  colors: {
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    secondaryContainer: '#4A4458',
    surface: '#141218',
    surfaceVariant: '#49454F',
    background: '#141218',
    outline: '#938F99',
    outlineVariant: '#49454F',
    elevation: {
      level0: 'transparent',
      level1: '#1D1B20',
      level2: '#211F26',
      level3: '#26232D',
    },
    tierS: '#FF7F7F',
    tierA: '#FFBF7F',
    tierB: '#FFDF7F',
    tierC: '#FFFF7F',
    tierD: '#BFFF7F',
  },
  roundness: 20,
};
