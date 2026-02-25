import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import { createBudget, updateBudget, getBudget } from '../budget.repository';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../auth/contexts/AuthContext';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { COLORS, FONTS, SHADOWS, SPACING, BORDER_RADIUS } from '../../../theme';
import {
    Check,
    ChevronLeft,
    FileText,
    User,
    MapPin,
    Clock,
    AlertCircle,
    CheckCircle,
    Send,
    LogOut,
} from 'lucide-react-native';

const STATUS_OPTIONS = [
    { label: 'Em Análise', value: 'EM_ANALISE', icon: Clock, color: '#92400E', bg: '#FEF3C7' },
    { label: 'Enviado', value: 'ENVIADO', icon: Send, color: '#1E40AF', bg: '#DBEAFE' },
    { label: 'Aprovado', value: 'APROVADO', icon: CheckCircle, color: '#166534', bg: '#DCFCE7' },
    { label: 'Recusado', value: 'RECUSADO', icon: AlertCircle, color: '#991B1B', bg: '#FEE2E2' },
];

export default function BudgetForm() {
    const navigation = useNavigation();
    const { user, signOut } = useAuth();
    const route = useRoute();
    const editId = (route.params as any)?.id as string | undefined;

    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<'EM_ANALISE' | 'ENVIADO' | 'APROVADO' | 'RECUSADO'>('EM_ANALISE');
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    //  Load existing budget data when editing
    useEffect(() => {
        if (editId) {
            setLoading(true);
            getBudget(editId).then((budget) => {
                if (budget) {
                    setTitle(budget.title);
                    setClient(budget.client_name);
                    setAddress(budget.address ?? '');
                    setStatus(budget.status || 'EM_ANALISE');
                }
                setLoading(false);
            });
        }
    }, [editId]);

    async function handleSave() {
        if (!user) return; // Should not happen if authenticated

        if (!title.trim() || !client.trim()) {
            Alert.alert('Atenção', 'Preencha o título e o nome do cliente.');
            return;
        }

        try {
            if (editId) {
                await updateBudget(editId, {
                    title: title.trim(),
                    client_name: client.trim(),
                    address: address.trim() || null,
                    status,
                });
            } else {
                await createBudget({
                    user_id: user.id,
                    title: title.trim(),
                    client_name: client.trim(),
                    address: address.trim() || undefined,
                    status,
                });
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o orçamento.');
        }
    }

    const isValid = title.trim().length > 0 && client.trim().length > 0;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Dark Navy Header */}
                <View style={styles.header}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && { opacity: 0.7 }
                        ]}
                    >
                        <ChevronLeft size={24} color={COLORS.white} strokeWidth={2.5} />
                    </Pressable>
                    <Text style={styles.headerTitle}>
                        {editId ? 'Editar Orçamento' : 'Novo Orçamento'}
                    </Text>
                    <Pressable
                        onPress={() => setShowLogoutModal(true)}
                        style={({ pressed }) => [
                            styles.logoutBtn,
                            pressed && { opacity: 0.7 }
                        ]}
                    >
                        <LogOut size={22} color={COLORS.error} />
                    </Pressable>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Form Card */}
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>TÍTULO DO ORÇAMENTO</Text>
                            <View style={styles.inputWrapper}>
                                <FileText size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Ex: Reforma Cozinha"
                                    placeholderTextColor={COLORS.textSecondary}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>NOME DO CLIENTE</Text>
                            <View style={styles.inputWrapper}>
                                <User size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    value={client}
                                    onChangeText={setClient}
                                    placeholder="Ex: Maria Silva"
                                    placeholderTextColor={COLORS.textSecondary}
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ENDEREÇO (Opcional)</Text>
                            <View style={styles.inputWrapper}>
                                <MapPin size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="Ex: Av. Paulista, 1000"
                                    placeholderTextColor={COLORS.textSecondary}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Status Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>STATUS</Text>
                        <View style={styles.statusGrid}>
                            {STATUS_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isSelected = status === option.value;
                                return (
                                    <Pressable
                                        key={option.value}
                                        onPress={() => setStatus(option.value as any)}
                                        style={[
                                            styles.statusCard,
                                            isSelected && {
                                                backgroundColor: option.bg,
                                                borderColor: option.color,
                                                borderWidth: 2,
                                            },
                                        ]}
                                    >
                                        <View style={[
                                            styles.iconBox,
                                            { backgroundColor: isSelected ? COLORS.white : '#F1F5F9' }
                                        ]}>
                                            <Icon
                                                size={20}
                                                color={isSelected ? option.color : COLORS.textSecondary}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.statusLabel,
                                                isSelected && {
                                                    color: option.color,
                                                    fontWeight: '700'
                                                },
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                        {isSelected && (
                                            <View style={styles.checkBadge}>
                                                <Check size={12} color={COLORS.white} strokeWidth={4} />
                                            </View>
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Save Button */}
                    <Pressable
                        onPress={handleSave}
                        disabled={!isValid}
                        style={({ pressed }) => [
                            styles.saveBtn,
                            !isValid && styles.saveBtnDisabled,
                            pressed && isValid && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                        ]}
                    >
                        <Check size={24} color={COLORS.white} strokeWidth={3} />
                        <Text style={styles.saveBtnText}>
                            Salvar Orçamento
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>

            <ConfirmationModal
                visible={showLogoutModal}
                title="Sair da Conta"
                message="Deseja realmente sair do aplicativo? Você precisará entrar novamente para acessar seus dados."
                confirmText="Sair agora"
                cancelText="Permanecer"
                onConfirm={signOut}
                onCancel={() => setShowLogoutModal(false)}
                type="logout"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },

    // Header — dark navy
    header: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.screen,
        paddingTop: Platform.OS === 'android' ? 52 : SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: 18,
        color: COLORS.white,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: SPACING.sm,
        letterSpacing: -0.2,
    },
    logoutBtn: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    scrollContent: {
        padding: SPACING.screen,
        paddingBottom: 48,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.cardLg,
        marginBottom: SPACING.section,
        ...SHADOWS.card,
    },
    sectionTitle: {
        fontFamily: FONTS.semiBold,
        fontSize: 10,
        color: COLORS.textMuted,
        marginBottom: SPACING.lg,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    // Inputs
    inputGroup: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontFamily: FONTS.semiBold,
        fontSize: 10,
        color: COLORS.textMuted,
        marginBottom: SPACING.sm,
        letterSpacing: 0.9,
        textTransform: 'uppercase',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardAlt,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
        paddingHorizontal: SPACING.xs,
        height: 52,
    },
    inputIcon: {
        marginRight: SPACING.md,
    },
    input: {
        flex: 1,
        fontFamily: FONTS.medium,
        fontSize: 16,
        color: COLORS.textPrimary,
    },

    // Status Grid
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    statusCard: {
        width: '48%',
        backgroundColor: '#F8FAFC',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        position: 'relative',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    statusLabel: {
        fontFamily: FONTS.semiBold,
        fontSize: 13,
        color: COLORS.textSecondary,
        letterSpacing: -0.1,
    },
    checkBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.primary,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Save Button
    saveBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.md,
        ...SHADOWS.button,
    },
    saveBtnDisabled: {
        backgroundColor: COLORS.border,
        shadowOpacity: 0,
    },
    saveBtnText: {
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
        fontSize: 16,
        letterSpacing: 0.2,
    },
});
