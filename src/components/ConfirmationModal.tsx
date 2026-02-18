import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
} from 'react-native';
import { COLORS, SHADOWS } from '../theme'; // Adjusted import path assuming it's in src/components
import { AlertTriangle, Trash2, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger',
}: ConfirmationModalProps) {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.9));

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true, // Spring effect could be better but timing is safer for consistency
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return <Trash2 size={32} color={COLORS.error} />;
            case 'warning':
                return <AlertTriangle size={32} color={COLORS.warning} />;
            default:
                return <AlertTriangle size={32} color={COLORS.primary} />;
        }
    };

    const getIconBgColor = () => {
        switch (type) {
            case 'danger':
                return '#FECACA'; // Red 200
            case 'warning':
                return '#FDE68A'; // Amber 200
            default:
                return '#BFDBFE'; // Blue 200
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none" // We handle animation manually
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        { opacity: fadeAnim }
                    ]}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: getIconBgColor() }]}>
                        {getIcon()}
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                pressed && { backgroundColor: '#F1F5F9' }
                            ]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                type === 'danger' ? styles.dangerButton : styles.primaryButton,
                                pressed && { opacity: 0.9 }
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        ...SHADOWS.card,
        shadowColor: '#000',
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dangerButton: {
        backgroundColor: COLORS.error,
        ...SHADOWS.button,
        shadowColor: COLORS.error,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.button,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
    },
});
