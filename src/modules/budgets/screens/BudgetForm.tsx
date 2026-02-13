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
} from 'react-native';
import { createBudget, updateBudget, getBudget } from '../budget.repository';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../../theme';

const STATUS_OPTIONS = [
    { label: '🟡  Em Análise', value: 'EM_ANALISE' },
    { label: '🚀  Enviado', value: 'ENVIADO' },
    { label: '✅  Aprovado', value: 'APROVADO' },
    { label: '❌  Recusado', value: 'RECUSADO' },
];

export default function BudgetForm() {
    const navigation = useNavigation();
    const route = useRoute();
    const editId = (route.params as any)?.id as string | undefined;

    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<'EM_ANALISE' | 'ENVIADO' | 'APROVADO' | 'RECUSADO'>('EM_ANALISE');
    const [loading, setLoading] = useState(false);

    // Load existing budget data when editing
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

    // Update header title
    useEffect(() => {
        navigation.setOptions({
            title: editId ? 'Editar Orçamento' : 'Novo Orçamento',
        });
    }, [editId]);

    async function handleSave() {
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>
                        {editId ? '✏️ Editar Orçamento' : '📝 Dados do Orçamento'}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título do orçamento</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Reforma cozinha"
                            placeholderTextColor={COLORS.textSecondary}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome do cliente</Text>
                        <TextInput
                            value={client}
                            onChangeText={setClient}
                            placeholder="Ex: João da Silva"
                            placeholderTextColor={COLORS.textSecondary}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço da obra</Text>
                        <TextInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Ex: Rua das Flores, 123"
                            placeholderTextColor={COLORS.textSecondary}
                            style={styles.input}
                        />
                        <Text style={styles.inputHint}>Opcional</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Status</Text>
                        <View style={styles.statusOptions}>
                            {STATUS_OPTIONS.map((option) => (
                                <Pressable
                                    key={option.value}
                                    onPress={() => setStatus(option.value as any)}
                                    style={[
                                        styles.statusOption,
                                        status === option.value && styles.statusOptionSelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusOptionText,
                                            status === option.value &&
                                            styles.statusOptionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <Pressable
                    onPress={handleSave}
                    disabled={!isValid}
                    style={({ pressed }) => [
                        styles.saveBtn,
                        !isValid && styles.saveBtnDisabled,
                        pressed && isValid && { opacity: 0.85 },
                    ]}
                >
                    <Text style={styles.saveBtnText}>
                        {editId ? '✓  Salvar Alterações' : '✓  Salvar Orçamento'}
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },

    // Form Card
    formCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        ...SHADOWS.card,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 24,
    },

    // Inputs
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    inputHint: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
        marginLeft: 4,
    },

    // Status Selector
    statusOptions: {
        gap: 8,
    },
    statusOption: {
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    statusOptionSelected: {
        backgroundColor: '#E8F8F0',
        borderColor: COLORS.primary,
    },
    statusOptionText: {
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    statusOptionTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },

    // Save Button
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtnDisabled: {
        backgroundColor: COLORS.border,
    },
    saveBtnText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 17,
    },
});
