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
    SafeAreaView,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../../theme';
import { useAuth } from '../contexts/AuthContext';
import FeedbackModal, { FeedbackType } from '../../../components/FeedbackModal';

const RegisterScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<{
        visible: boolean;
        type: FeedbackType;
        title: string;
        message: string;
        actionText?: string;
        onAction?: () => void;
    }>({
        visible: false,
        type: 'error',
        title: '',
        message: '',
    });
    const { signUp } = useAuth();

    const showModal = (
        type: FeedbackType,
        title: string,
        message: string,
        actionText?: string,
        onAction?: () => void
    ) => {
        setModal({ visible: true, type, title, message, actionText, onAction });
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            showModal('warning', 'Campos obrigatórios', 'Por favor, preencha todos os campos para criar sua conta.');
            return;
        }

        if (password !== confirmPassword) {
            showModal('warning', 'Senhas diferentes', 'As senhas digitadas não conferem. Verifique e tente novamente.');
            return;
        }

        if (password.length < 6) {
            showModal('warning', 'Senha muito curta', 'Sua senha precisa ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password, name);
            showModal(
                'success',
                'Conta criada! 🎉',
                'Seu cadastro foi realizado com sucesso. Faça login para começar a usar o ConstruApp.',
                'Fazer Login',
                () => navigation.navigate('Login')
            );
        } catch (error: any) {
            showModal('error', 'Erro no Cadastro', error.message || 'Não foi possível criar sua conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../../assets/LOGO.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Crie sua conta</Text>
                        <Text style={styles.subtitle}>Junte-se à ConstruApp hoje</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nome completo:</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Como quer ser chamado?"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Seu melhor e-mail:</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite seu e-mail"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Defina uma senha:</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Mínimo 6 caracteres"
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Confirme sua senha:</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Repita sua senha"
                                    placeholderTextColor={COLORS.textMuted}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.registerButton, loading && { opacity: 0.7 }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.registerButtonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Footer Section */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já possui uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <FeedbackModal
                visible={modal.visible}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                actionText={modal.actionText}
                onAction={modal.onAction}
                onClose={() => setModal(m => ({ ...m, visible: false }))}
            />
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
        paddingTop: 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
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
        overflow: 'hidden',
    },
    logoImage: {
        width: 75,
        height: 75,
    },
    title: {
        ...TYPOGRAPHY.h2,
        color: COLORS.primary,
        fontSize: 24,
    },
    subtitle: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: SPACING.lg,
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
    registerButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
        ...SHADOWS.button,
    },
    registerButtonText: {
        ...TYPOGRAPHY.button,
        color: COLORS.white,
        fontWeight: 'bold',
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
    loginLink: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.accent,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
