import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../../theme';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header/Logo Section */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="construct" size={60} color={COLORS.accent} />
                        </View>
                        <Text style={styles.appName}>ConstruApp</Text>
                        <Text style={styles.tagline}>Orçamentos Profissionais</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>E-mail ou Usuário:</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite seu e-mail"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sua senha:</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color={COLORS.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => {/* In Phase 3 we will add auth logic */ }}
                        >
                            <Text style={styles.loginButtonText}>Entrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.googleButton}>
                            <Ionicons name="logo-google" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
                            <Text style={styles.googleButtonText}>Login com Google</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Não tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.signUpLink}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.xxl,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.cardMd,
        marginBottom: SPACING.md,
    },
    appName: {
        ...TYPOGRAPHY.display,
        color: COLORS.primary,
        fontSize: 32,
    },
    tagline: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: SPACING.xl,
    },
    label: {
        ...TYPOGRAPHY.label,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        fontSize: 12,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.md,
        height: 56,
    },
    input: {
        ...TYPOGRAPHY.body,
        color: COLORS.textPrimary,
        height: '100%',
        width: '100%',
    },
    eyeIcon: {
        padding: 5,
    },
    forgotPassword: {
        alignSelf: 'center',
        marginBottom: SPACING.xl,
    },
    forgotPasswordText: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
    loginButton: {
        backgroundColor: COLORS.accent,
        height: 56,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        ...SHADOWS.button,
    },
    loginButtonText: {
        ...TYPOGRAPHY.button,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        height: 56,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.xl,
    },
    googleButtonText: {
        ...TYPOGRAPHY.bodyMedium,
        color: COLORS.primary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
    },
    footerText: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
    },
    signUpLink: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.accent,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
