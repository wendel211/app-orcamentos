import { StyleSheet } from 'react-native';

export const COLORS = {
    // Dark Navy Palette (reference image)
    primary: '#0F2D4A',        // Deep navy blue
    primaryDark: '#0A1F33',    // Darker navy for pressed states
    primaryLight: '#1A4A73',   // Lighter navy for hover/secondary
    accent: '#2E7DD1',         // Bright blue accent for highlights

    background: '#F4F6F9',     // Very light cool gray background
    card: '#FFFFFF',           // Pure white cards
    cardAlt: '#F8FAFC',        // Slightly off-white for nested elements

    // Text Colors
    textPrimary: '#0F2D4A',    // Navy (same as primary for strong contrast)
    textSecondary: '#6B7A8D',  // Muted blue-gray
    textMuted: '#A0AEBB',      // Very muted for hints

    // Borders & UI
    border: '#E8EDF2',         // Soft cool border
    divider: '#EEF1F5',        // Even softer divider

    // Status Colors
    success: '#1A7A4A',        // Deep green
    successBg: '#E8F5EE',
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
        shadowColor: '#0F2D4A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
    },
    cardMd: {
        shadowColor: '#0F2D4A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 12,
        elevation: 5,
    },
    button: {
        shadowColor: '#0F2D4A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.20,
        shadowRadius: 8,
        elevation: 6,
    },
});

export const CARD = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        ...SHADOWS.card,
    },
});

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
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
        fontSize: 32,
        lineHeight: 40,
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
        letterSpacing: -0.5,
        color: COLORS.textPrimary,
    },
    h3: {
        fontFamily: FONTS.semiBold,
        fontSize: 18,
        lineHeight: 26,
        color: COLORS.textPrimary,
    },
    body: {
        fontFamily: FONTS.regular,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.textPrimary,
    },
    bodySmall: {
        fontFamily: FONTS.regular,
        fontSize: 13,
        lineHeight: 20,
        color: COLORS.textSecondary,
    },
    caption: {
        fontFamily: FONTS.medium,
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.5,
        color: COLORS.textMuted,
        textTransform: 'uppercase' as const,
    },
    button: {
        fontFamily: FONTS.semiBold,
        fontSize: 15,
        letterSpacing: 0.5,
    },
};
