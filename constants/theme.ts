import { Platform } from 'react-native';

export const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  success: {
    light: '#10B981',
    dark: '#059669',
  },
  error: {
    light: '#EF4444',
    dark: '#DC2626',
  },
  warning: {
    light: '#F59E0B',
    dark: '#D97706',
  },
};

export type Theme = {
  colors: {
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryText: string;
    card: string;
    cardPressed: string;
    success: string;
    error: string;
    warning: string;
  };
  shadows: {
    small: any;
    medium: any;
    large: any;
  };
};

export const lightTheme: Theme = {
  colors: {
    background: '#FFFFFF',
    text: colors.gray[900],
    textSecondary: colors.gray[500],
    border: colors.gray[200],
    primary: colors.primary[500],
    primaryText: '#FFFFFF',
    card: colors.gray[50],
    cardPressed: colors.gray[100],
    success: colors.success.light,
    error: colors.error.light,
    warning: colors.warning.light,
  },
  shadows: Platform.select({
    ios: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    },
    android: {
      small: { elevation: 2 },
      medium: { elevation: 4 },
      large: { elevation: 8 },
    },
    default: {},
  }),
};

export const darkTheme: Theme = {
  colors: {
    background: colors.gray[900],
    text: colors.gray[50],
    textSecondary: colors.gray[400],
    border: colors.gray[700],
    primary: colors.primary[400],
    primaryText: colors.gray[900],
    card: colors.gray[800],
    cardPressed: colors.gray[700],
    success: colors.success.dark,
    error: colors.error.dark,
    warning: colors.warning.dark,
  },
  shadows: lightTheme.shadows,
};