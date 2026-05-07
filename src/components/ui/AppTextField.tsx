import React from 'react';
import {
    KeyboardTypeOptions,
    StyleSheet,
    Text,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, FONTS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { GSInput } from './gluestack';

interface AppTextFieldProps extends Omit<TextInputProps, 'style'> {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    secureToggle?: boolean;
    passwordVisible?: boolean;
    onTogglePassword?: () => void;
    keyboardType?: KeyboardTypeOptions;
}

export default function AppTextField({
    label,
    value,
    onChangeText,
    containerStyle,
    inputStyle,
    leftIcon,
    secureToggle,
    passwordVisible,
    onTogglePassword,
    placeholderTextColor = COLORS.textMuted,
    secureTextEntry,
    ...props
}: AppTextFieldProps) {
    const shouldHideText = secureToggle ? !passwordVisible : secureTextEntry;

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>
            <GSInput style={styles.inputShell}>
                {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
                <GSInput.Input
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor={placeholderTextColor}
                    secureTextEntry={shouldHideText}
                    style={[styles.input, inputStyle]}
                    {...props}
                />
                {secureToggle ? (
                    <GSInput.Slot focusOnPress={false} style={styles.iconSlot}>
                        <TouchableOpacity onPress={onTogglePassword} style={styles.iconButton}>
                            {passwordVisible ? (
                                <EyeOff size={21} color={COLORS.textSecondary} />
                            ) : (
                                <Eye size={21} color={COLORS.textSecondary} />
                            )}
                        </TouchableOpacity>
                    </GSInput.Slot>
                ) : null}
            </GSInput>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.lg,
    },
    label: {
        ...TYPOGRAPHY.label,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        fontSize: 12,
    },
    inputShell: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.md,
    },
    input: {
        flex: 1,
        minHeight: 54,
        fontFamily: FONTS.regular,
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    leftIcon: {
        marginRight: SPACING.sm,
    },
    iconSlot: {
        marginLeft: SPACING.sm,
    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
