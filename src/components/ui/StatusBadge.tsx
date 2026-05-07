import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../theme';

interface StatusBadgeProps {
    label: string;
    color?: string;
    backgroundColor?: string;
    icon?: React.ReactNode;
    style?: ViewStyle;
}

export default function StatusBadge({
    label,
    color = COLORS.primary,
    backgroundColor = COLORS.infoBg,
    icon,
    style,
}: StatusBadgeProps) {
    return (
        <View style={[styles.badge, { backgroundColor }, style]}>
            {icon}
            <Text style={[styles.text, { color }]} numberOfLines={1}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        minHeight: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.pill,
    },
    text: {
        fontFamily: FONTS.semiBold,
        fontSize: 10,
        letterSpacing: 0.2,
    },
});
