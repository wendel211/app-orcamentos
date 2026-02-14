import { StyleSheet } from 'react-native';

export const COLORS = {
    // New Modern Blue Palette
    primary: '#3B82F6',       // Bright Blue
    primaryDark: '#2563EB',   // Darker Blue for active states
    secondary: '#60A5FA',     // Lighter Blue
    background: '#F8FAFC',    // Very light slate/gray background
    card: '#FFFFFF',          // Pure white for cards

    // Text Colors
    textPrimary: '#1E293B',   // Slate 800 (High contrast)
    textSecondary: '#64748B', // Slate 500 (Medium contrast)

    // Borders & UI
    border: '#E2E8F0',        // Slate 200

    // Status Colors
    success: '#10B981',       // Emerald 500
    warning: '#F59E0B',       // Amber 500
    error: '#EF4444',         // Red 500
    white: '#FFFFFF',
};

export const SHADOWS = StyleSheet.create({
    card: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,    // Slightly stronger but softer
        shadowRadius: 12,
        elevation: 5,           // Higher elevation for Android
    },
    button: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    }
});

export const CARD = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        borderRadius: 20,       // More rounded
        padding: 24,
        ...SHADOWS.card,
    },
});
