import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Lock, Mail, User } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS } from '../../../theme';
import { useAuth } from '../contexts/AuthContext';
import FeedbackModal, { FeedbackType } from '../../../components/FeedbackModal';
import { AppButton, AppTextField } from '../../../components/ui';

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
            showModal('warning', 'Campos obrigatorios', 'Por favor, preencha todos os campos para criar sua conta.');
            return;
        }

        if (password !== confirmPassword) {
            showModal('warning', 'Senhas diferentes', 'As senhas digitadas nao conferem. Verifique e tente novamente.');
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
                'Conta criada!',
                'Seu cadastro foi realizado com sucesso. Faca login para comecar a usar o ConstruApp.',
                'Fazer Login',
                () => navigation.navigate('Login')
            );
        } catch (error: any) {
            showModal('error', 'Erro no Cadastro', error.message || 'Nao foi possivel criar sua conta. Tente novamente.');
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
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../../../assets/LOGO.png')}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Crie sua conta</Text>
                        <Text style={styles.subtitle}>Junte-se a ConstruApp hoje</Text>
                    </View>

                    <View style={styles.form}>
                        <AppTextField
                            label="Nome completo"
                            placeholder="Como quer ser chamado?"
                            value={name}
                            onChangeText={setName}
                            leftIcon={<User size={19} color={COLORS.primary} />}
                            containerStyle={styles.field}
                        />

                        <AppTextField
                            label="Seu melhor e-mail"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            leftIcon={<Mail size={19} color={COLORS.primary} />}
                            containerStyle={styles.field}
                        />

                        <AppTextField
                            label="Defina uma senha"
                            placeholder="Minimo 6 caracteres"
                            value={password}
                            onChangeText={setPassword}
                            secureToggle
                            passwordVisible={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            leftIcon={<Lock size={19} color={COLORS.primary} />}
                            containerStyle={styles.field}
                        />

                        <AppTextField
                            label="Confirme sua senha"
                            placeholder="Repita sua senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            leftIcon={<Lock size={19} color={COLORS.primary} />}
                            containerStyle={styles.field}
                        />

                        <AppButton
                            title="Cadastrar"
                            onPress={handleRegister}
                            disabled={loading}
                            loading={loading}
                            style={styles.registerButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Ja possui uma conta? </Text>
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
    field: {
        marginBottom: SPACING.lg,
    },
    registerButton: {
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
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
