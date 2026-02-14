import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Platform
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listBudgets } from '../budget.repository';
import { syncData } from '../../sync/sync.service';
import { COLORS, SHADOWS } from '../../../theme';
import {
    Plus,
    Calendar,
    MapPin,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    Send
} from 'lucide-react-native';

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
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    function getStatusBadge(status: string) {
        switch (status) {
            case 'APROVADO':
                return { label: 'Aprovado', bg: '#DCFCE7', color: '#166534', icon: CheckCircle };
            case 'RECUSADO':
                return { label: 'Recusado', bg: '#FEE2E2', color: '#991B1B', icon: AlertCircle };
            case 'ENVIADO':
                return { label: 'Enviado', bg: '#DBEAFE', color: '#1E40AF', icon: Send };
            default:
                return { label: 'Em Análise', bg: '#FEF3C7', color: '#92400E', icon: Clock };
        }
    }

    // Counts
    const countTotal = data.length;
    const countApproved = data.filter(b => b.status === 'APROVADO').length;
    const countPending = data.filter(b => b.status === 'EM_ANALISE' || !b.status).length;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            {/* Header Area */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerGreeting}>Olá, Mestre!</Text>
                    <Text style={styles.headerSubtitle}>Vamos gerenciar suas obras</Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
                        <FileText size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.statValue}>{countTotal}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                        <CheckCircle size={20} color={COLORS.success} />
                    </View>
                    <Text style={styles.statValue}>{countApproved}</Text>
                    <Text style={styles.statLabel}>Aprovados</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                        <Clock size={20} color={'#D97706'} />
                    </View>
                    <Text style={styles.statValue}>{countPending}</Text>
                    <Text style={styles.statLabel}>Análise</Text>
                </View>
            </View>

            {/* List Header */}
            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Seus Orçamentos</Text>
                <Pressable
                    onPress={() => (navigation as any).navigate('BudgetForm')}
                    style={({ pressed }) => [
                        styles.addBtn,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                    ]}
                >
                    <Plus size={20} color={COLORS.white} strokeWidth={3} />
                    <Text style={styles.addBtnText}>Novo</Text>
                </Pressable>
            </View>

            {/* List */}
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                renderItem={({ item }) => {
                    const status = getStatusBadge(item.status);
                    const StatusIcon = status.icon;

                    return (
                        <Pressable
                            onPress={() =>
                                (navigation as any).navigate('BudgetDetails', {
                                    id: item.id,
                                })
                            }
                            style={({ pressed }) => [
                                styles.card,
                                pressed && { transform: [{ scale: 0.98 }] },
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                                <View style={[styles.badge, { backgroundColor: status.bg }]}>
                                    <StatusIcon size={12} color={status.color} strokeWidth={2.5} />
                                    <Text style={[styles.badgeText, { color: status.color }]}>
                                        {status.label}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardBody}>
                                <View style={styles.metaRow}>
                                    <User size={16} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{item.client_name}</Text>
                                </View>

                                <View style={styles.metaRow}>
                                    <Calendar size={16} color={COLORS.textSecondary} />
                                    <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
                                </View>

                                {item.address && (
                                    <View style={styles.metaRow}>
                                        <MapPin size={16} color={COLORS.textSecondary} />
                                        <Text style={styles.metaText} numberOfLines={1}>{item.address}</Text>
                                    </View>
                                )}
                            </View>
                        </Pressable>
                    );
                }}
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

    // Header
    header: {
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 20,
        marginBottom: 10,
    },
    headerGreeting: {
        fontSize: 34,
        fontWeight: '800',
        color: COLORS.textPrimary,
        letterSpacing: -1.5,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
        letterSpacing: -0.5,
    },


    // Stats
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        alignItems: 'flex-start',
        ...SHADOWS.card,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },

    // List Header
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        gap: 6,
        ...SHADOWS.button,
    },
    addBtnText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 14,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    cardBody: {
        gap: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
        flex: 1,
    },
});
