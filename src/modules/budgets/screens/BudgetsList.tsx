import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listBudgets } from '../budget.repository';
import { syncData } from '../../sync/sync.service';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { COLORS, FONTS, SHADOWS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../../theme';
import {
    Plus,
    Calendar,
    MapPin,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    Send,
    Search,
    X,
    BarChart2,
    ChevronRight,
} from 'lucide-react-native';

export default function BudgetsList() {
    const navigation = useNavigation();
    const [data, setData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [budgetToDelete, setBudgetToDelete] = useState<any | null>(null);

    const load = async () => {
        const result = await listBudgets();
        setData(result);
    };

    const handleDeletePress = (budget: any) => setBudgetToDelete(budget);

    const confirmDelete = async () => {
        if (!budgetToDelete) return;
        try {
            const { deleteBudget } = await import('../budget.repository');
            await deleteBudget(budgetToDelete.id);
            setBudgetToDelete(null);
            await load();
        } catch {
            setBudgetToDelete(null);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await syncData();
        await load();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            load();
            syncData().then(() => load());
        }, [])
    );

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case 'APROVADO':
                return { label: 'Aprovado', bg: COLORS.successBg, color: COLORS.success, icon: CheckCircle, accent: COLORS.success };
            case 'RECUSADO':
                return { label: 'Recusado', bg: COLORS.errorBg, color: COLORS.error, icon: AlertCircle, accent: COLORS.error };
            case 'ENVIADO':
                return { label: 'Enviado', bg: COLORS.infoBg, color: COLORS.info, icon: Send, accent: COLORS.info };
            default:
                return { label: 'Em Análise', bg: COLORS.warningBg, color: COLORS.warning, icon: Clock, accent: COLORS.warning };
        }
    }

    const countTotal = data.length;
    const countApproved = data.filter(b => b.status === 'APROVADO').length;
    const countPending = data.filter(b => b.status === 'EM_ANALISE' || !b.status).length;

    const query = search.trim().toLowerCase();
    const filtered = query
        ? data.filter(b =>
            b.title?.toLowerCase().includes(query) ||
            b.client_name?.toLowerCase().includes(query) ||
            b.address?.toLowerCase().includes(query)
        )
        : data;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* Dark Navy Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Orçamentos</Text>
                    <Text style={styles.headerSub}>Gerencie seus projetos</Text>
                </View>
                <Pressable
                    onPress={() => (navigation as any).navigate('Dashboard')}
                    style={({ pressed }) => [styles.dashBtn, pressed && { opacity: 0.7 }]}
                >
                    <BarChart2 size={24} color={COLORS.white} />
                </Pressable>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{countTotal}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: COLORS.success }]}>{countApproved}</Text>
                    <Text style={styles.statLabel}>Aprovados</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statCard}>
                    <Text style={[styles.statValue, { color: COLORS.warning }]}>{countPending}</Text>
                    <Text style={styles.statLabel}>Em Análise</Text>
                </View>
            </View>

            {/* Search + New Button */}
            <View style={styles.toolbar}>
                <View style={styles.searchWrapper}>
                    <Search size={20} color={COLORS.textSecondary} />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar orçamento..."
                        placeholderTextColor={COLORS.textMuted}
                        style={styles.searchInput}
                        returnKeyType="search"
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch('')} hitSlop={8}>
                            <X size={20} color={COLORS.textSecondary} />
                        </Pressable>
                    )}
                </View>
                <Pressable
                    onPress={() => (navigation as any).navigate('BudgetForm')}
                    style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
                >
                    <Plus size={24} color={COLORS.white} strokeWidth={2.5} />
                </Pressable>
            </View>

            {/* Section Label */}
            {filtered.length > 0 && (
                <Text style={styles.sectionLabel}>
                    {query ? `${filtered.length} resultado(s)` : 'Todos os orçamentos'}
                </Text>
            )}

            {/* List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <View style={styles.emptyIcon}>
                            <FileText size={40} color={COLORS.textMuted} />
                        </View>
                        <Text style={styles.emptyText}>
                            {query ? 'Nenhum resultado' : 'Nenhum orçamento ainda'}
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {query ? 'Tente outro termo de busca' : 'Toque em + para criar o primeiro'}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const status = getStatusBadge(item.status);
                    const StatusIcon = status.icon;

                    return (
                        <Pressable
                            onPress={() => (navigation as any).navigate('BudgetDetails', { id: item.id })}
                            style={({ pressed }) => [
                                styles.card,
                                pressed && { transform: [{ scale: 0.985 }], opacity: 0.95 },
                            ]}
                        >
                            {/* Left accent */}
                            <View style={[styles.cardAccent, { backgroundColor: status.accent }]} />

                            <View style={styles.cardContent}>
                                {/* Title + Badge */}
                                <View style={styles.cardTop}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                                    <View style={[styles.badge, { backgroundColor: status.bg }]}>
                                        <StatusIcon size={12} color={status.color} strokeWidth={2.5} />
                                        <Text style={[styles.badgeText, { color: status.color }]}>
                                            {status.label}
                                        </Text>
                                    </View>
                                </View>

                                {/* Meta info */}
                                <View style={styles.metaContainer}>
                                    <View style={styles.metaRow}>
                                        <User size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.metaText}>{item.client_name}</Text>
                                    </View>
                                    <View style={styles.metaRow}>
                                        <Calendar size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
                                    </View>
                                    {item.address && (
                                        <View style={styles.metaRow}>
                                            <MapPin size={14} color={COLORS.textSecondary} />
                                            <Text style={styles.metaText} numberOfLines={1}>{item.address}</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Footer */}
                                <View style={styles.cardFooter}>
                                    <Pressable
                                        onPress={() => handleDeletePress(item)}
                                        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}
                                        hitSlop={8}
                                    >
                                        <Text style={styles.deleteBtnText}>Excluir</Text>
                                    </Pressable>
                                    <View style={styles.detailsHint}>
                                        <Text style={styles.detailsHintText}>Ver detalhes</Text>
                                        <ChevronRight size={16} color={COLORS.accent} />
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    );
                }}
            />

            <ConfirmationModal
                visible={!!budgetToDelete}
                title="Excluir Orçamento"
                message={`Tem certeza que deseja excluir "${budgetToDelete?.title}"?`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                onConfirm={confirmDelete}
                onCancel={() => setBudgetToDelete(null)}
                type="danger"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // Header — dark navy
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingTop: Platform.OS === 'android' ? SPACING.xxxl : SPACING.xl,
        paddingBottom: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    headerTitle: {
        ...TYPOGRAPHY.display,
        fontSize: 28,
        color: COLORS.white,
    },
    headerSub: {
        ...TYPOGRAPHY.bodySmall,
        color: 'rgba(255,255,255,0.7)',
        marginTop: SPACING.xs,
    },
    dashBtn: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Stats row — white card attached to header
    statsRow: {
        backgroundColor: COLORS.card,
        flexDirection: 'row',
        marginHorizontal: SPACING.lg,
        marginTop: -SPACING.xl,
        borderRadius: BORDER_RADIUS.lg,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.md,
        ...SHADOWS.cardMd,
        marginBottom: SPACING.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...TYPOGRAPHY.h2,
        color: COLORS.textPrimary,
    },
    statLabel: {
        ...TYPOGRAPHY.caption,
        marginTop: SPACING.xs,
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.xs,
    },

    // Toolbar
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
        gap: SPACING.sm,
        ...SHADOWS.card,
    },
    searchInput: {
        flex: 1,
        ...TYPOGRAPHY.body,
        padding: 0,
    },
    addBtn: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.button,
    },

    // Section label
    sectionLabel: {
        ...TYPOGRAPHY.caption,
        paddingHorizontal: SPACING.xl,
        marginBottom: SPACING.md,
    },

    // List
    listContent: {
        paddingBottom: 100,
        paddingHorizontal: SPACING.lg,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.md,
        flexDirection: 'row',
        overflow: 'hidden',
        ...SHADOWS.card,
    },
    cardAccent: {
        width: 6,
    },
    cardContent: {
        flex: 1,
        padding: SPACING.lg,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    cardTitle: {
        ...TYPOGRAPHY.h3,
        fontSize: 17,
        flex: 1,
        marginRight: SPACING.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.sm,
        gap: 4,
    },
    badgeText: {
        fontFamily: FONTS.bold,
        fontSize: 11,
        textTransform: 'uppercase',
    },
    metaContainer: {
        gap: SPACING.xs,
        marginBottom: SPACING.md,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    metaText: {
        ...TYPOGRAPHY.bodySmall,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
    },
    deleteBtn: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.errorBg,
    },
    deleteBtnText: {
        fontFamily: FONTS.semiBold,
        fontSize: 12,
        color: COLORS.error,
    },
    detailsHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    detailsHintText: {
        fontFamily: FONTS.semiBold,
        fontSize: 13,
        color: COLORS.accent,
    },

    // Empty state
    emptyBox: {
        alignItems: 'center',
        paddingVertical: SPACING.xxxl,
        gap: SPACING.md,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: COLORS.card,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.card,
    },
    emptyText: {
        ...TYPOGRAPHY.h3,
        textAlign: 'center',
    },
    emptySubtext: {
        ...TYPOGRAPHY.bodySmall,
        textAlign: 'center',
    },
});
