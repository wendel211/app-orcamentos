import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getBudget, deleteBudget } from '../budget.repository';
import { COLORS, SHADOWS } from '../../../theme';

export default function BudgetDetails() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as any;
    const [budget, setBudget] = useState<any>(null);

    const load = async () => {
        const result = await getBudget(id);
        setBudget(result);
    };

    useFocusEffect(
        useCallback(() => {
            load();
        }, [id])
    );

    function handleEdit() {
        (navigation as any).navigate('BudgetForm', { id: budget.id });
    }

    function handleDelete() {
        Alert.alert(
            'Excluir Orçamento',
            `Tem certeza que deseja excluir "${budget.title}"?\n\nEsta ação não pode ser desfeita.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteBudget(budget.id);
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Erro', 'Não foi possível excluir o orçamento.');
                        }
                    },
                },
            ]
        );
    }

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    if (!budget) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Main Info Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📋 Informações</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Título</Text>
                    <Text style={styles.infoValue}>{budget.title}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Cliente</Text>
                    <Text style={styles.infoValue}>{budget.client_name}</Text>
                </View>

                {budget.address ? (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>📍 Endereço</Text>
                            <Text style={styles.infoValue}>{budget.address}</Text>
                        </View>
                    </>
                ) : null}
            </View>

            {/* Date & Status Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📅 Datas e Status</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Criado em</Text>
                    <Text style={styles.infoValue}>
                        {formatDate(budget.created_at)}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Atualizado em</Text>
                    <Text style={styles.infoValue}>
                        {formatDate(budget.updated_at)}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: budget.synced
                                    ? '#E8F8F0'
                                    : '#FEF3E2',
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.statusDot,
                                {
                                    backgroundColor: budget.synced
                                        ? COLORS.success
                                        : COLORS.warning,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.statusLabel,
                                {
                                    color: budget.synced
                                        ? COLORS.success
                                        : COLORS.warning,
                                },
                            ]}
                        >
                            {budget.synced ? 'Sincronizado' : 'Pendente de sincronização'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsCard}>
                <Pressable
                    onPress={handleEdit}
                    style={({ pressed }) => [
                        styles.actionBtn,
                        styles.editBtn,
                        pressed && { opacity: 0.85 },
                    ]}
                >
                    <Text style={styles.editBtnText}>✏️  Editar Orçamento</Text>
                </Pressable>

                <Pressable
                    onPress={handleDelete}
                    style={({ pressed }) => [
                        styles.actionBtn,
                        styles.deleteBtn,
                        pressed && { opacity: 0.85 },
                    ]}
                >
                    <Text style={styles.deleteBtnText}>🗑  Excluir Orçamento</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.card,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },

    // Info Rows
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: '600',
        maxWidth: '60%',
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 4,
    },

    // Status
    statusContainer: {
        marginTop: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
    },

    // Actions
    actionsCard: {
        gap: 12,
        marginBottom: 16,
    },
    actionBtn: {
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editBtn: {
        backgroundColor: COLORS.primary,
    },
    editBtnText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    },
    deleteBtn: {
        backgroundColor: COLORS.card,
        borderWidth: 1.5,
        borderColor: '#E74C3C',
    },
    deleteBtnText: {
        color: '#E74C3C',
        fontWeight: '700',
        fontSize: 16,
    },
});
