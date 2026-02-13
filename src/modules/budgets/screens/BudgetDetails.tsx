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

    function getStatusBadge(status: string) {
        switch (status) {
            case 'APROVADO':
                return { label: 'Aprovado', bg: '#E8F8F0', color: COLORS.success, icon: '✅' };
            case 'RECUSADO':
                return { label: 'Recusado', bg: '#FDECEC', color: '#E74C3C', icon: '❌' };
            case 'ENVIADO':
                return { label: 'Enviado', bg: '#EBF5FB', color: '#3498DB', icon: '🚀' };
            default:
                return { label: 'Em Análise', bg: '#FEF9E7', color: '#F1C40F', icon: '🟡' };
        }
    }

    if (!budget) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const statusStyle = getStatusBadge(budget.status || 'EM_ANALISE');

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* Status Sync Indicator (Small) */}
            <View style={styles.syncIndicator}>
                <Text style={styles.syncText}>
                    {budget.synced ? '☁️ Salvo na nuvem' : '⏳ Pendente de envio'}
                </Text>
            </View>

            {/* Main Info Card */}
            <View style={styles.card}>
                <View style={[styles.headerRow, { borderBottomColor: statusStyle.bg, borderBottomWidth: 0 }]}>
                    <Text style={styles.cardTitle}>📋 Informações</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
                            {statusStyle.icon} {statusStyle.label}
                        </Text>
                    </View>
                </View>

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

            {/* Dates Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📅 Datas</Text>

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

    // Sync Indicator
    syncIndicator: {
        alignItems: 'center',
        marginBottom: 16,
    },
    syncText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        backgroundColor: '#E8ECEF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.card,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },

    // Status Badge
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '700',
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
