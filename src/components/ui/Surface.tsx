import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SPACING, BORDER_RADIUS } from '../../theme';

interface SurfaceProps {
    children: React.ReactNode;
    style?: ViewStyle;
    elevated?: boolean;
}

export default function Surface({ children, style, elevated = true }: SurfaceProps) {
    return (
        <View style={[styles.surface, elevated && SHADOWS.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    surface: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});
