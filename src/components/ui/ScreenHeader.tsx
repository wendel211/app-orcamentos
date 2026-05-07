import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../theme';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export default function ScreenHeader({ title, subtitle, onBack, rightAction }: ScreenHeaderProps) {
    return (
        <View style={styles.header}>
            {onBack ? (
                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                >
                    <ChevronLeft size={24} color={COLORS.white} strokeWidth={2.5} />
                </Pressable>
            ) : (
                <View style={styles.iconButtonPlaceholder} />
            )}
            <View style={styles.titleWrap}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {rightAction ? rightAction : <View style={styles.iconButtonPlaceholder} />}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.screen,
        paddingTop: Platform.OS === 'android' ? 52 : SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonPlaceholder: {
        width: 40,
        height: 40,
    },
    titleWrap: {
        flex: 1,
        paddingHorizontal: SPACING.md,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: 19,
        color: COLORS.white,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: FONTS.regular,
        fontSize: 12,
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        marginTop: 2,
    },
    pressed: {
        opacity: 0.72,
    },
});
