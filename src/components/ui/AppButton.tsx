import React from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { COLORS, FONTS, SHADOWS, SPACING, BORDER_RADIUS } from '../../theme';
import { GSButton } from './gluestack';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppButtonProps {
    title: string;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function AppButton({
    title,
    onPress,
    variant = 'primary',
    size = 'lg',
    disabled = false,
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = true,
    style,
    textStyle,
}: AppButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <GSButton
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }: { pressed: boolean }) => [
                styles.base,
                styles[size],
                styles[variant],
                fullWidth && styles.fullWidth,
                pressed && !isDisabled && styles.pressed,
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? COLORS.white : COLORS.primary} />
            ) : (
                <>
                    {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
                    <GSButton.Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
                        {title}
                    </GSButton.Text>
                    {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
                </>
            )}
        </GSButton>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sm: {
        minHeight: 40,
        paddingHorizontal: SPACING.md,
    },
    md: {
        minHeight: 48,
        paddingHorizontal: SPACING.lg,
    },
    lg: {
        minHeight: 56,
        paddingHorizontal: SPACING.xl,
    },
    fullWidth: {
        width: '100%',
    },
    primary: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.button,
    },
    secondary: {
        backgroundColor: COLORS.accent,
    },
    outline: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: COLORS.error,
        ...SHADOWS.button,
        shadowColor: COLORS.error,
    },
    pressed: {
        opacity: 0.84,
        transform: [{ scale: 0.99 }],
    },
    disabled: {
        opacity: 0.62,
    },
    text: {
        fontFamily: FONTS.semiBold,
        fontSize: 15,
        textAlign: 'center',
    },
    primaryText: {
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    ghostText: {
        color: COLORS.accent,
    },
    dangerText: {
        color: COLORS.white,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
