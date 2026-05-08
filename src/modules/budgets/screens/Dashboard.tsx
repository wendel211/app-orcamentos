import React, { useCallback, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Pressable,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/contexts/AuthContext';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { COLORS, FONTS, SHADOWS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../../theme';
import { LoadingState, ScreenHeader, StatusBadge, Surface } from '../../../components/ui';
import {
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Send,
    DollarSign,
    BarChart2,
    Calendar,
    Award,
    Target,
    LogOut,
} from 'lucide-react-native';
import { getDashboardData, DashboardData } from '../budget.repository';

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
    APROVADO: { label: 'Aprovado', color: COLORS.success, bg: COLORS.successBg, icon: CheckCircle },
    ENVIADO: { label: 'Enviado', color: COLORS.info, bg: COLORS.infoBg, icon: Send },
    EM_ANALISE: { label: 'Em analise', color: COLORS.warning, bg: COLORS.warningBg, icon: Clock },
    RECUSADO: { label: 'Recusado', color: COLORS.error, bg: COLORS.errorBg, icon: AlertCircle },
};

export default function Dashboard() {
    const navigation = useNavigation();
    const { user, signOut } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                getDashboardData(user.id).then(setData);
            }
        }, [user])
    );

    if (!data) {
        return <LoadingState label="Carregando dashboard..." />;
    }

    const now = new Date();
    const monthName = now.toLocaleDateString('pt-BR', { month: 'long' });

    return (
        <SafeAreaView style={styles.container}>
            <ScreenHeader
                title="Dashboard"
                subtitle="Visao geral dos seus orcamentos"
                onBack={() => navigation.goBack()}
                rightAction={
                    <Pressable
                        onPress={() => setShowLogoutModal(true)}
                        style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
                    >
                        <LogOut size={22} color={COLORS.error} />
                    </Pressable>
                }
            />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Surface style={styles.heroCard}>
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
                            <Text style={styles.heroStatLabel}>Ticket medio</Text>
                            <Text style={styles.heroStatValue}>{fmtShort(data.averageTicket)}</Text>
                        </View>
                    </View>
                </Surface>

                <View style={styles.kpiRow}>
                    <Surface style={styles.kpiCard}>
                        <View style={[styles.kpiIcon, { backgroundColor: '#EFF6FF' }]}>
                            <BarChart2 size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.kpiValue}>{data.totalBudgets}</Text>
                        <Text style={styles.kpiLabel}>Total</Text>
                    </Surface>
                    <Surface style={styles.kpiCard}>
                        <View style={[styles.kpiIcon, { backgroundColor: '#DCFCE7' }]}>
                            <Target size={20} color="#166534" />
                        </View>
                        <Text style={[styles.kpiValue, { color: '#166534' }]}>{data.approvalRate}%</Text>
                        <Text style={styles.kpiLabel}>Aprovacao</Text>
                    </Surface>
                    <Surface style={styles.kpiCard}>
                        <View style={[styles.kpiIcon, { backgroundColor: '#DCFCE7' }]}>
                            <CheckCircle size={20} color="#166534" />
                        </View>
                        <Text style={[styles.kpiValue, { color: '#166534' }]}>{data.totalApproved}</Text>
                        <Text style={styles.kpiLabel}>Aprovados</Text>
                    </Surface>
                </View>

                <Surface style={styles.card}>
                    <Text style={styles.cardTitle}>Por status</Text>
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
                </Surface>

                <Surface style={styles.card}>
                    <Text style={styles.cardTitle}>Recentes</Text>
                    {data.recentBudgets.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum orcamento ainda</Text>
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
                                    <StatusBadge
                                        label={meta.label}
                                        color={meta.color}
                                        backgroundColor={meta.bg}
                                    />
                                </Pressable>
                            );
                        })
                    )}
                </Surface>
            </ScrollView>

            <ConfirmationModal
                visible={showLogoutModal}
                title="Sair da Conta"
                message="Deseja realmente sair do aplicativo? Voce precisara entrar novamente para acessar seus dados."
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
    },
    logoutBtn: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.14)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: SPACING.screen,
        paddingBottom: 56,
    },
    heroCard: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.xxl,
        padding: SPACING.cardLg,
        marginBottom: SPACING.md,
        ...SHADOWS.button,
    },
    heroTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    heroIconBox: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroLabel: {
        fontFamily: FONTS.semiBold,
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    heroValue: {
        fontFamily: FONTS.extraBold,
        fontSize: 36,
        color: COLORS.white,
        letterSpacing: -1.5,
        marginBottom: SPACING.xl,
    },
    heroDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        marginBottom: SPACING.xl,
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
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    heroStatLabel: {
        fontFamily: FONTS.medium,
        fontSize: 11,
        color: 'rgba(255,255,255,0.6)',
        textTransform: 'capitalize',
    },
    heroStatValue: {
        fontFamily: FONTS.bold,
        fontSize: 15,
        color: COLORS.white,
        letterSpacing: -0.2,
    },
    kpiRow: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.md,
    },
    kpiCard: {
        flex: 1,
        padding: SPACING.lg,
        alignItems: 'flex-start',
    },
    kpiIcon: {
        width: 36,
        height: 36,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    kpiValue: {
        fontFamily: FONTS.extraBold,
        fontSize: 22,
        letterSpacing: -0.5,
        color: COLORS.textPrimary,
    },
    kpiLabel: {
        fontFamily: FONTS.medium,
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 3,
        letterSpacing: 0.2,
    },
    card: {
        marginBottom: SPACING.md,
    },
    cardTitle: {
        fontFamily: FONTS.bold,
        fontSize: 16,
        color: COLORS.primary,
        marginBottom: SPACING.lg,
        letterSpacing: -0.3,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    statusDot: {
        width: 30,
        height: 30,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusLabel: {
        fontFamily: FONTS.medium,
        fontSize: 13,
        color: COLORS.textSecondary,
        width: 88,
    },
    barTrack: {
        flex: 1,
        height: 7,
        backgroundColor: COLORS.divider,
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    statusCount: {
        fontFamily: FONTS.bold,
        fontSize: 14,
        width: 24,
        textAlign: 'right',
    },
    recentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    recentDot: {
        width: 34,
        height: 34,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTitle: {
        fontFamily: FONTS.semiBold,
        fontSize: 14,
        color: COLORS.textPrimary,
        letterSpacing: -0.1,
    },
    recentClient: {
        fontFamily: FONTS.regular,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    emptyText: {
        fontFamily: FONTS.regular,
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingVertical: SPACING.xl,
    },
});
