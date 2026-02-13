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
    const [syncing, setSyncing] = useState(false);

    const load = async () => {
        const result = await listBudgets();
        setData(result);
    };

    const handleSync = async () => {
        setSyncing(true);
        const result = await syncData();
        setSyncing(false);

        if (result.success) {
            Alert.alert('Sucesso', 'Sincronização concluída!');
            load();
        } else {
            Alert.alert('Erro', 'Falha ao sincronizar. Verifique sua conexão.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            load();
        }, [])
    );

    const syncedCount = data.filter((b) => b.synced).length;

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
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
                            {syncedCount}
                        </Text>
                        <Text style={styles.summaryLabel}>Sincronizados</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryNumber, { color: COLORS.warning }]}>
                            {data.length - syncedCount}
                        </Text>
                        <Text style={styles.summaryLabel}>Pendentes</Text>
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

                <Pressable
                    onPress={handleSync}
                    disabled={syncing}
                    style={({ pressed }) => [
                        styles.btnOutline,
                        pressed && { opacity: 0.85 },
                        syncing && { opacity: 0.6 },
                    ]}
                >
                    {syncing ? (
                        <ActivityIndicator color={COLORS.primary} size="small" />
                    ) : (
                        <Text style={styles.btnOutlineText}>☁️  Sincronizar</Text>
                    )}
                </Pressable>
            </View>

            {/* Budget List */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
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
                renderItem={({ item }) => (
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
                            <View style={styles.budgetCardLeft}>
                                <View
                                    style={[
                                        styles.statusDot,
                                        {
                                            backgroundColor: item.synced
                                                ? COLORS.success
                                                : COLORS.warning,
                                        },
                                    ]}
                                />
                                <View style={styles.budgetInfo}>
                                    <Text style={styles.budgetTitle}>{item.title}</Text>
                                    <Text style={styles.budgetClient}>
                                        {item.client_name}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.budgetCardRight}>
                                <Text
                                    style={[
                                        styles.statusText,
                                        {
                                            color: item.synced
                                                ? COLORS.success
                                                : COLORS.warning,
                                        },
                                    ]}
                                >
                                    {item.synced ? 'Sincronizado' : 'Pendente'}
                                </Text>
                                <Text style={styles.chevron}>›</Text>
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
                )}
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
    btnOutline: {
        flex: 1,
        backgroundColor: COLORS.card,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnOutlineText: {
        color: COLORS.primary,
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
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    budgetCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    budgetInfo: {
        flex: 1,
    },
    budgetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    budgetClient: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    budgetCardRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    chevron: {
        fontSize: 22,
        color: COLORS.textSecondary,
        fontWeight: '300',
    },

    // Bottom row for date/address
    budgetCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
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
