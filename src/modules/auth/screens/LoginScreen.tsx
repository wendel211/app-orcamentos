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
import { Lock, Mail } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../../theme';
import { useAuth } from '../contexts/AuthContext';
import FeedbackModal, { FeedbackType } from '../../../components/FeedbackModal';
import { AppButton, AppTextField } from '../../../components/ui';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState<{ visible: boolean; type: FeedbackType; title: string; message: string }>({
        visible: false,
        type: 'error',
        title: '',
        message: '',
    });
    const { signIn } = useAuth();

    const showModal = (type: FeedbackType, title: string, message: string) => {
        setModal({ visible: true, type, title, message });
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showModal('warning', 'Campos obrigatorios', 'Por favor, preencha o e-mail e a senha para continuar.');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error: any) {
            showModal('error', 'Falha no Login', error.message || 'Credenciais invalidas. Verifique seus dados e tente novamente.');
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
                        <Text style={styles.appName}>ConstruApp</Text>
                        <Text style={styles.tagline}>Orcamentos profissionais</Text>
                    </View>

                    <View style={styles.form}>
                        <AppTextField
                            label="E-mail ou usuario"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            leftIcon={<Mail size={19} color={COLORS.primary} />}
                            containerStyle={styles.field}
                        />

                        <AppTextField
                            label="Sua senha"
                            placeholder="Digite sua senha"
                            value={password}
                            onChangeText={setPassword}
                            secureToggle
                            passwordVisible={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            leftIcon={<Lock size={19} color={COLORS.primary} />}
                            containerStyle={styles.field}
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
                        </TouchableOpacity>

                        <AppButton
                            title="Entrar"
                            onPress={handleLogin}
                            disabled={loading}
                            loading={loading}
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Nao tem uma conta? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.signUpLink}>Cadastre-se</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <FeedbackModal
                visible={modal.visible}
                type={modal.type}
                title={modal.title}
                message={modal.message}
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
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.cardMd,
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    logoImage: {
        width: 90,
        height: 90,
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
    field: {
        marginBottom: SPACING.xl,
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
    signUpLink: {
        ...TYPOGRAPHY.bodySmall,
        color: COLORS.accent,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
