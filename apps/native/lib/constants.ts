// DeenQuest Color Palette
export const COLORS = {
  primary: "#015055", // Dark teal
  secondary: "#E1F396", // Light green
  dark: "#222222", // Dark gray
  light: "#FFFFFF", // White
  accent: "#10b981", // Success green
  warning: "#f59e0b", // Warning yellow
  error: "#ef4444", // Error red
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

export const NAV_THEME = {
  light: {
    background: COLORS.light,
    border: COLORS.gray[200],
    card: COLORS.light,
    notification: COLORS.error,
    primary: COLORS.primary,
    text: COLORS.dark,
  },
  dark: {
    background: COLORS.dark,
    border: COLORS.gray[700],
    card: COLORS.dark,
    notification: COLORS.error,
    primary: COLORS.secondary,
    text: COLORS.light,
  },
};

export const DEEN_COLORS = {
  light: {
    primary: '#015055',
    secondary: '#F8FFFE',
    accent: '#10b981',
    dark: '#1f2937',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    cardBackground: '#ffffff',
  },
  dark: {
    primary: '#20b2aa',
    secondary: '#1a1a1a',
    accent: '#34d399',
    dark: '#f9fafb',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    border: '#374151',
    cardBackground: '#1f2937',
  },
};
