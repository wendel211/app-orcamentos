import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, Dimensions } from 'react-native';
import { COLORS, FONTS, TYPOGRAPHY, SPACING } from '../../../theme';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.title}>ConstruApp</Text>
                    <View style={styles.divider} />
                    <Text style={styles.description}>
                        Seu assistente para criar e gerenciar orçamentos de obras de forma profissional e rápida.
                    </Text>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <ActivityIndicator size="large" color={COLORS.accent} />
                <Text style={styles.loadingText}>Iniciando o aplicativo...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xxxl,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        ...TYPOGRAPHY.display,
        color: COLORS.white,
        fontSize: 42,
        marginBottom: SPACING.md,
    },
    divider: {
        height: 4,
        width: 60,
        backgroundColor: COLORS.accent,
        borderRadius: 2,
        marginBottom: SPACING.xl,
    },
    description: {
        ...TYPOGRAPHY.body,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontSize: 18,
        lineHeight: 28,
    },
    footer: {
        marginBottom: SPACING.xxxl * 2,
        alignItems: 'center',
    },
    loadingText: {
        ...TYPOGRAPHY.label,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: SPACING.md,
    },
});

export default SplashScreen;
