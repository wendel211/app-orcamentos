import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../theme';

interface LoadingStateProps {
    label?: string;
}

export default function LoadingState({ label = 'Carregando...' }: LoadingStateProps) {
    return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        gap: SPACING.md,
    },
    label: {
        fontFamily: FONTS.medium,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
});
