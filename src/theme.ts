import { StyleSheet } from 'react-native';

export const COLORS = {
    primary: '#2ECC71',
    primaryDark: '#27AE60',
    background: '#F5F6FA',
    card: '#FFFFFF',
    textPrimary: '#2D3436',
    textSecondary: '#636E72',
    border: '#E8ECEF',
    warning: '#F39C12',
    success: '#2ECC71',
    white: '#FFFFFF',
};

export const SHADOWS = StyleSheet.create({
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
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
