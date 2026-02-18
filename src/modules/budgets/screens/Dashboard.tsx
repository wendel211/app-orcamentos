import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Platform,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../../theme';
import { getDashboardData, DashboardData } from '../budget.repository';
import {
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Send,
    DollarSign,
    BarChart2,
    Calendar,
    ChevronLeft,
    Award,
    Target,
} from 'lucide-react-native';

function fmt(value: number) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtShort(value: number) {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
    }
    return `R$ ${fmt(value)}`;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    APROVADO: { label: 'Aprovado', color: '#166534', bg: '#DCFCE7', icon: CheckCircle },
    ENVIADO: { label: 'Enviado', color: '#1E40AF', bg: '#DBEAFE', icon: Send },
    EM_ANALISE: { label: 'Em Análise', color: '#92400E', bg: '#FEF3C7', icon: Clock },
    RECUSADO: { label: 'Recusado', color: '#991B1B', bg: '#FEE2E2', icon: AlertCircle },
};

export default function Dashboard() {
    const navigation = useNavigation();
    const [data, setData] = useState<DashboardData | null>(null);

    useFocusEffect(
        useCallback(() => {
            getDashboardData().then(setData);
        }, [])
    );

    if (!data) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const now = new Date();
    const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [styles.backBtn, pressed && { backgroundColor: '#F1F5F9' }]}
                >
                    <ChevronLeft size={28} color={COLORS.primary} strokeWidth={2.5} />
                </Pressable>
                <View>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <Text style={styles.headerSub}>Visão geral dos seus orçamentos</Text>
                </View>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Revenue Hero Card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroTop}>
                        <View style={styles.heroIconBox}>
                            <DollarSign size={24} color={COLORS.white} />
                        </View>
                        <Text style={styles.heroLabel}>RECEITA TOTAL (APROVADOS)</Text>
                    </View>
                    <Text style={styles.heroValue}>R$ {fmt(data.revenueTotal)}</Text>
                    <View style={styles.heroDivider} />
                    <View style={styles.heroRow}>
                        <View style={styles.heroStat}>
                            <Calendar size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.heroStatLabel}>Esta semana</Text>
                            <Text style={styles.heroStatValue}>{fmtShort(data.revenueThisWeek)}</Text>
                        </View>
                        <View style={styles.heroStatDivider} />
                        <View style={styles.heroStat}>
                            <TrendingUp size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.heroStatLabel}>{monthName}</Text>
                            <Text style={styles.heroStatValue}>{fmtShort(data.revenueThisMonth)}</Text>
                        </View>
                        <View style={styles.heroStatDivider} />
                        <View style={styles.heroStat}>
                            <Award size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.heroStatLabel}>Ticket médio</Text>
                            <Text style={styles.heroStatValue}>{fmtShort(data.averageTicket)}</Text>
                        </View>
                    </View>
                </View>

                {/* KPI Row */}
                <View style={styles.kpiRow}>
                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIcon, { backgroundColor: '#EFF6FF' }]}>
                            <BarChart2 size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.kpiValue}>{data.totalBudgets}</Text>
                        <Text style={styles.kpiLabel}>Total</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIcon, { backgroundColor: '#DCFCE7' }]}>
                            <Target size={20} color="#166534" />
                        </View>
                        <Text style={[styles.kpiValue, { color: '#166534' }]}>{data.approvalRate}%</Text>
                        <Text style={styles.kpiLabel}>Aprovação</Text>
                    </View>
                    <View style={styles.kpiCard}>
                        <View style={[styles.kpiIcon, { backgroundColor: '#DCFCE7' }]}>
                            <CheckCircle size={20} color="#166534" />
                        </View>
                        <Text style={[styles.kpiValue, { color: '#166534' }]}>{data.totalApproved}</Text>
                        <Text style={styles.kpiLabel}>Aprovados</Text>
                    </View>
                </View>

                {/* Status Breakdown */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Por Status</Text>
                    {[
                        { key: 'APROVADO', count: data.totalApproved },
                        { key: 'ENVIADO', count: data.totalSent },
                        { key: 'EM_ANALISE', count: data.totalPending },
                        { key: 'RECUSADO', count: data.totalRejected },
                    ].map(({ key, count }) => {
                        const meta = STATUS_META[key];
                        const Icon = meta.icon;
                        const pct = data.totalBudgets > 0 ? (count / data.totalBudgets) * 100 : 0;
                        return (
                            <View key={key} style={styles.statusRow}>
                                <View style={[styles.statusDot, { backgroundColor: meta.bg }]}>
                                    <Icon size={14} color={meta.color} />
                                </View>
                                <Text style={styles.statusLabel}>{meta.label}</Text>
                                <View style={styles.barTrack}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            {
                                                width: `${pct}%` as any,
                                                backgroundColor: meta.color,
                                                opacity: 0.25 + (pct / 100) * 0.75,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.statusCount, { color: meta.color }]}>{count}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Recent Budgets */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recentes</Text>
                    {data.recentBudgets.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum orçamento ainda</Text>
                    ) : (
                        data.recentBudgets.map((b) => {
                            const meta = STATUS_META[b.status ?? 'EM_ANALISE'];
                            const Icon = meta.icon;
                            return (
                                <Pressable
                                    key={b.id}
                                    onPress={() => (navigation as any).navigate('BudgetDetails', { id: b.id })}
                                    style={({ pressed }) => [
                                        styles.recentRow,
                                        pressed && { opacity: 0.75 },
                                    ]}
                                >
                                    <View style={[styles.recentDot, { backgroundColor: meta.bg }]}>
                                        <Icon size={14} color={meta.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.recentTitle} numberOfLines={1}>{b.title}</Text>
                                        <Text style={styles.recentClient} numberOfLines={1}>{b.client_name}</Text>
                                    </View>
                                    <View style={[styles.recentBadge, { backgroundColor: meta.bg }]}>
                                        <Text style={[styles.recentBadgeText, { color: meta.color }]}>
                                            {meta.label}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.card,
        ...SHADOWS.card,
        shadowOpacity: 0.05,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textPrimary,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize: 13,
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },

    content: {
        padding: 20,
        paddingBottom: 48,
    },

    // Hero card
    heroCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        ...SHADOWS.button,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    heroIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 0.8,
    },
    heroValue: {
        fontSize: 38,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: -1.5,
        marginBottom: 20,
    },
    heroDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: 20,
    },
    heroRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heroStat: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    heroStatDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    heroStatLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.65)',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    heroStatValue: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.white,
    },

    // KPI row
    kpiRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    kpiCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 16,
        alignItems: 'flex-start',
        ...SHADOWS.card,
    },
    kpiIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    kpiValue: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    kpiLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
        marginTop: 2,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.card,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 16,
        letterSpacing: -0.3,
    },

    // Status breakdown
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    statusDot: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
        width: 90,
    },
    barTrack: {
        flex: 1,
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    statusCount: {
        fontSize: 14,
        fontWeight: '700',
        width: 24,
        textAlign: 'right',
    },

    // Recent budgets
    recentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    recentDot: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    recentClient: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    recentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    recentBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingVertical: 16,
    },
});
