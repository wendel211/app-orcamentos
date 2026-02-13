import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listBudgets } from '../budget.repository';
import { syncData } from '../../sync/sync.service';
import { COLORS, SHADOWS } from '../../../theme';

export default function BudgetsList() {
    const navigation = useNavigation();
    const [data, setData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        const result = await listBudgets();
        setData(result);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        // Sync in background on refresh
        await syncData();
        await load();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            load();
            // Trigger background sync when screen is focused
            syncData().then(() => load());
        }, [])
    );

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
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

    return (
        <View style={styles.container}>
            {/* Summary Card */}
            <View style={styles.summaryCard}>
                <Text style={styles.greeting}>👷 Olá, mestre!</Text>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryNumber}>{data.length}</Text>
                        <Text style={styles.summaryLabel}>Orçamentos</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryNumber, { color: COLORS.success }]}>
                            {data.filter(b => b.status === 'APROVADO').length}
                        </Text>
                        <Text style={styles.summaryLabel}>Aprovados</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryNumber, { color: '#F1C40F' }]}>
                            {data.filter(b => b.status === 'EM_ANALISE' || !b.status).length}
                        </Text>
                        <Text style={styles.summaryLabel}>Em Análise</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
                <Pressable
                    onPress={() => (navigation as any).navigate('BudgetForm')}
                    style={({ pressed }) => [
                        styles.btnPrimary,
                        pressed && { opacity: 0.85 },
                    ]}
                >
                    <Text style={styles.btnPrimaryText}>＋  Novo Orçamento</Text>
                </Pressable>
            </View>

            {/* Budget List */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📋</Text>
                        <Text style={styles.emptyText}>
                            Nenhum orçamento ainda
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Toque em "Novo Orçamento" para começar
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const status = getStatusBadge(item.status);
                    return (
                        <Pressable
                            onPress={() =>
                                (navigation as any).navigate('BudgetDetails', {
                                    id: item.id,
                                })
                            }
                            style={({ pressed }) => [
                                styles.budgetCard,
                                pressed && { transform: [{ scale: 0.98 }] },
                            ]}
                        >
                            <View style={styles.budgetCardTop}>
                                <View style={styles.budgetInfo}>
                                    <Text style={styles.budgetTitle}>{item.title}</Text>
                                    <View style={styles.clientRow}>
                                        <Text style={styles.userIcon}>👤</Text>
                                        <Text style={styles.budgetClient}>
                                            {item.client_name}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.budgetCardRight}>
                                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                                        <Text style={[styles.statusText, { color: status.color }]}>
                                            {status.icon} {status.label}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Bottom row: date + address */}
                            <View style={styles.budgetCardBottom}>
                                <Text style={styles.budgetMeta}>
                                    📅 {formatDate(item.created_at)}
                                </Text>
                                {item.address ? (
                                    <Text style={styles.budgetMeta} numberOfLines={1}>
                                        📍 {item.address}
                                    </Text>
                                ) : null}
                            </View>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    // Summary Card
    summaryCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.card,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryNumber: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    summaryLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        height: 36,
        backgroundColor: COLORS.border,
    },

    // Actions
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimaryText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 15,
    },

    // Empty State
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },

    // Budget Card
    budgetCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        ...SHADOWS.card,
    },
    budgetCardTop: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    budgetInfo: {
        flex: 1,
        marginRight: 10,
    },
    budgetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    clientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    userIcon: {
        fontSize: 14,
    },
    budgetClient: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    budgetCardRight: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },

    // Bottom row for date/address
    budgetCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        gap: 12,
    },
    budgetMeta: {
        fontSize: 12,
        color: COLORS.textSecondary,
        flexShrink: 1,
    },
});
