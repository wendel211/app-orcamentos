import { StyleSheet } from 'react-native';

export const COLORS = {
    // Dark Navy Palette (reference image)
    primary: '#0F2D4A',        // Deep navy blue
    primaryDark: '#0A1F33',    // Darker navy for pressed states
    primaryLight: '#1A4A73',   // Lighter navy for hover/secondary
    accent: '#2E7DD1',         // Bright blue accent for highlights

    background: '#F0F4F8',     // Light cool blue-gray background
    card: '#FFFFFF',           // Pure white cards
    cardAlt: '#F8FAFC',        // Slightly off-white for nested elements

    // Text Colors
    textPrimary: '#0F2D4A',    // Navy (same as primary for strong contrast)
    textSecondary: '#5A6A7E',  // Muted blue-gray (slightly stronger contrast)
    textMuted: '#9BAABB',      // Very muted for hints

    // Borders & UI
    border: '#E4EAF0',         // Soft cool border
    divider: '#EEF2F7',        // Even softer divider

    // Status Colors
    success: '#1A7A4A',        // Deep green
    successBg: '#E6F4ED',
    warning: '#B45309',        // Amber
    warningBg: '#FEF3C7',
    error: '#C0392B',          // Deep red
    errorBg: '#FDECEA',
    info: '#1E5FA8',           // Deep blue
    infoBg: '#DBEAFE',

    white: '#FFFFFF',
    black: '#000000',
};

// Font family helpers — use these everywhere instead of fontWeight strings
export const FONTS = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extraBold: 'Inter_800ExtraBold',
};

export const SHADOWS = StyleSheet.create({
    card: {
        shadowColor: '#0A1F33',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    cardMd: {
        shadowColor: '#0A1F33',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.10,
        shadowRadius: 16,
        elevation: 6,
    },
    button: {
        shadowColor: '#0F2D4A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 10,
        elevation: 6,
    },
});

export const CARD = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        ...SHADOWS.card,
    },
});

export const SPACING = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    xxxl: 48,
    section: 24,   // Standard gap between screen sections
    screen: 20,    // Horizontal screen padding
    card: 20,      // Internal card padding
    cardLg: 24,    // Internal large card padding
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    pill: 999,
};

export const TYPOGRAPHY = {
    display: {
        fontFamily: FONTS.extraBold,
        fontSize: 30,
        lineHeight: 38,
        letterSpacing: -1,
        color: COLORS.textPrimary,
    },
    h1: {
        fontFamily: FONTS.bold,
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: -0.5,
        color: COLORS.textPrimary,
    },
    h2: {
        fontFamily: FONTS.bold,
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.4,
        color: COLORS.textPrimary,
    },
    h3: {
        fontFamily: FONTS.semiBold,
        fontSize: 17,
        lineHeight: 24,
        letterSpacing: -0.2,
        color: COLORS.textPrimary,
    },
    body: {
        fontFamily: FONTS.regular,
        fontSize: 15,
        lineHeight: 23,
        color: COLORS.textPrimary,
    },
    bodyMedium: {
        fontFamily: FONTS.medium,
        fontSize: 15,
        lineHeight: 23,
        color: COLORS.textPrimary,
    },
    bodySmall: {
        fontFamily: FONTS.regular,
        fontSize: 13,
        lineHeight: 19,
        color: COLORS.textSecondary,
    },
    caption: {
        fontFamily: FONTS.semiBold,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.7,
        color: COLORS.textMuted,
        textTransform: 'uppercase' as const,
    },
    label: {
        fontFamily: FONTS.semiBold,
        fontSize: 10,
        lineHeight: 14,
        letterSpacing: 0.9,
        color: COLORS.textSecondary,
        textTransform: 'uppercase' as const,
    },
    button: {
        fontFamily: FONTS.semiBold,
        fontSize: 15,
        letterSpacing: 0.3,
    },
    buttonSm: {
        fontFamily: FONTS.semiBold,
        fontSize: 13,
        letterSpacing: 0.2,
    },
};
