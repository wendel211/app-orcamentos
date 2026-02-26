import React, { useEffect, useCallback } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
} from 'react-native';
import { COLORS, SHADOWS, BORDER_RADIUS, FONTS } from '../theme';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackModalProps {
    visible: boolean;
    type: FeedbackType;
    title: string;
    message: string;
    onClose: () => void;
    /** Optional action button (e.g. "Go to Login") */
    actionText?: string;
    onAction?: () => void;
}

const CONFIG: Record<
    FeedbackType,
    { icon: React.ReactNode; accent: string; bg: string; barColor: string }
> = {
    success: {
        icon: <CheckCircle size={36} color="#1A7A4A" />,
        accent: '#1A7A4A',
        bg: '#E6F4ED',
        barColor: '#1A7A4A',
    },
    error: {
        icon: <XCircle size={36} color="#C0392B" />,
        accent: '#C0392B',
        bg: '#FDECEA',
        barColor: '#C0392B',
    },
    warning: {
        icon: <AlertTriangle size={36} color="#B45309" />,
        accent: '#B45309',
        bg: '#FEF3C7',
        barColor: '#B45309',
    },
    info: {
        icon: <Info size={36} color="#1E5FA8" />,
        accent: '#1E5FA8',
        bg: '#DBEAFE',
        barColor: '#1E5FA8',
    },
};

export default function FeedbackModal({
    visible,
    type,
    title,
    message,
    onClose,
    actionText,
    onAction,
}: FeedbackModalProps) {
    const [fadeAnim] = React.useState(new Animated.Value(0));
    const [slideAnim] = React.useState(new Animated.Value(40));

    const config = CONFIG[type];

    const animateIn = useCallback(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const animateOut = useCallback((callback?: () => void) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 40,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(callback);
    }, [fadeAnim, slideAnim]);

    useEffect(() => {
        if (visible) {
            animateIn();
        } else {
            animateOut();
        }
    }, [visible, animateIn, animateOut]);

    const handleClose = () => {
        animateOut(onClose);
    };

    const handleAction = () => {
        if (onAction) {
            animateOut(onAction);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
                <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Top color bar */}
                    <View style={[styles.topBar, { backgroundColor: config.barColor }]} />

                    {/* Icon */}
                    <View style={[styles.iconWrapper, { backgroundColor: config.bg }]}>
                        {config.icon}
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        {actionText && onAction ? (
                            <>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.btn,
                                        styles.outlineBtn,
                                        pressed && { opacity: 0.7 },
                                    ]}
                                    onPress={handleClose}
                                >
                                    <Text style={styles.outlineBtnText}>Fechar</Text>
                                </Pressable>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.btn,
                                        { backgroundColor: config.accent },
                                        pressed && { opacity: 0.85 },
                                    ]}
                                    onPress={handleAction}
                                >
                                    <Text style={styles.filledBtnText}>{actionText}</Text>
                                </Pressable>
                            </>
                        ) : (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.btn,
                                    styles.fullBtn,
                                    { backgroundColor: config.accent },
                                    pressed && { opacity: 0.85 },
                                ]}
                                onPress={handleClose}
                            >
                                <Text style={styles.filledBtnText}>Entendido</Text>
                            </Pressable>
                        )}
                    </View>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    card: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        ...SHADOWS.cardMd,
        paddingBottom: 28,
    },
    topBar: {
        width: '100%',
        height: 6,
        marginBottom: 28,
    },
    iconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontFamily: FONTS.bold,
        fontSize: 20,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 20,
    },
    message: {
        fontFamily: FONTS.regular,
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 21,
        paddingHorizontal: 24,
        marginBottom: 28,
    },
    buttons: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 24,
        width: '100%',
    },
    btn: {
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    fullBtn: {
        flex: 1,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    outlineBtnText: {
        fontFamily: FONTS.semiBold,
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    filledBtnText: {
        fontFamily: FONTS.semiBold,
        fontSize: 15,
        color: '#FFFFFF',
    },
});
