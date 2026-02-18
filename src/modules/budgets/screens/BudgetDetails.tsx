import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Alert,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView,
    Platform
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getBudget, deleteBudget } from '../budget.repository';
import { listItems } from '../../items/item.repository';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { COLORS, SHADOWS } from '../../../theme';
import {
    Edit2,
    Trash2,
    Calendar,
    MapPin,
    User,
    CheckCircle,
    Clock,
    Cloud,
    CloudOff,
    AlertCircle,
    Send,
    ChevronLeft,
    Calculator,
    ChevronRight
} from 'lucide-react-native';

export default function BudgetDetails() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params as any;
    const [budget, setBudget] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemsTotal, setItemsTotal] = useState(0);
    const [itemsCount, setItemsCount] = useState(0);

    const load = async () => {
        const result = await getBudget(id);
        setBudget(result);
        const items = await listItems(id);
        const subtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
        const discount = result?.discount ?? 0;
        const extraFee = result?.extra_fee ?? 0;
        setItemsTotal(subtotal - discount + extraFee);
        setItemsCount(items.length);
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
        setShowDeleteModal(true);
    }

    async function confirmDelete() {
        try {
            await deleteBudget(budget.id);
            setShowDeleteModal(false);
            navigation.goBack();
        } catch (error) {
            setShowDeleteModal(false);
            Alert.alert('Erro', 'Falha ao excluir.');
        }
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
                return { label: 'Aprovado', bg: '#DCFCE7', color: '#166534', icon: CheckCircle }; // Green 100/800
            case 'RECUSADO':
                return { label: 'Recusado', bg: '#FEE2E2', color: '#991B1B', icon: AlertCircle }; // Red 100/800
            case 'ENVIADO':
                return { label: 'Enviado', bg: '#DBEAFE', color: '#1E40AF', icon: Send };       // Blue 100/800
            default: // EM_ANALISE
                return { label: 'Em Análise', bg: '#FEF3C7', color: '#92400E', icon: Clock };    // Amber 100/800
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
    const StatusIcon = statusStyle.icon;

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header (Simple & Clean) - Sync remove from here */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && { backgroundColor: '#F1F5F9' }
                    ]}
                >
                    <ChevronLeft size={28} color={COLORS.primary} strokeWidth={2.5} />
                </Pressable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Banner */}
                <View style={[styles.statusBanner, { backgroundColor: statusStyle.bg }]}>
                    <StatusIcon size={20} color={statusStyle.color} strokeWidth={2.5} />
                    <Text style={[styles.statusBannerText, { color: statusStyle.color }]}>
                        {statusStyle.label}
                    </Text>
                </View>

                {/* Main Info Card */}
                <View style={styles.card}>
                    <Text style={styles.cardSectionTitle}>Informações</Text>

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>TÍTULO DO ORÇAMENTO</Text>
                        <Text style={styles.value}>{budget.title}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>CLIENTE</Text>
                        <View style={styles.valueRow}>
                            <User size={18} color={COLORS.primary} />
                            <Text style={styles.value}>{budget.client_name}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoItem}>
                        <Text style={styles.label}>ENDEREÇO</Text>
                        <View style={styles.valueRow}>
                            <MapPin size={18} color={COLORS.primary} />
                            <Text style={styles.value}>{budget.address || 'Não informado'}</Text>
                        </View>
                    </View>
                </View>

                {/* Dates Card - Sync Indicator Here */}
                <View style={styles.card}>
                    <Text style={styles.cardSectionTitle}>Histórico</Text>

                    <View style={styles.dateRow}>
                        <Calendar size={18} color={COLORS.textSecondary} />
                        <View>
                            <Text style={styles.label}>CRIADO EM</Text>
                            <Text style={styles.dateValue}>{formatDate(budget.created_at)}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.dateRow}>
                        <Clock size={18} color={COLORS.textSecondary} />
                        <View>
                            <Text style={styles.label}>ÚLTIMA ATUALIZAÇÃO</Text>
                            <View style={styles.dateValueRow}>
                                <Text style={styles.dateValue}>{formatDate(budget.updated_at)}</Text>
                                {/* Visual Sync Indicator Only */}
                                {budget.synced ? (
                                    <Cloud size={16} color={COLORS.success} />
                                ) : (
                                    <CloudOff size={16} color={COLORS.warning} />
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Items & Calculations Card */}
                <Pressable
                    onPress={() => (navigation as any).navigate('BudgetItems', { budgetId: budget.id })}
                    style={({ pressed }) => [
                        styles.itemsCard,
                        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                    ]}
                >
                    <View style={styles.itemsCardLeft}>
                        <View style={styles.itemsIconBox}>
                            <Calculator size={22} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.itemsCardTitle}>Itens & Cálculos</Text>
                            <Text style={styles.itemsCardSub}>
                                {itemsCount === 0
                                    ? 'Nenhum item adicionado'
                                    : `${itemsCount} ${itemsCount === 1 ? 'item' : 'itens'} · R$ ${itemsTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                }
                            </Text>
                        </View>
                    </View>
                    <ChevronRight size={20} color={COLORS.textSecondary} />
                </Pressable>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <Pressable
                        onPress={handleEdit}
                        style={({ pressed }) => [
                            styles.btn,
                            styles.btnEdit,
                            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                        ]}
                    >
                        <Edit2 size={20} color={COLORS.white} />
                        <Text style={styles.btnText}>Editar</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleDelete}
                        style={({ pressed }) => [
                            styles.btn,
                            styles.btnDelete,
                            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                        ]}
                    >
                        <Trash2 size={20} color={COLORS.error} />
                        <Text style={[styles.btnText, { color: COLORS.error }]}>Excluir</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <ConfirmationModal
                visible={showDeleteModal}
                title="Excluir Orçamento"
                message={`Tem certeza que deseja excluir o orçamento "${budget?.title}"? Essa ação não pode ser desfeita.`}
                confirmText="Sim, excluir"
                cancelText="Cancelar"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
                type="danger"
            />
        </SafeAreaView >
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

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // Changed to flex-start
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.card,
        ...SHADOWS.card,
        shadowOpacity: 0.05,
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },

    // Status Banner
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 8,
    },
    statusBannerText: {
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Cards
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        ...SHADOWS.card,
    },
    cardSectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 20,
        letterSpacing: -0.5,
    },

    // Info Items
    infoItem: {
        marginBottom: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    // Dates
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    dateValue: {
        fontSize: 15,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    dateValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 16,
    },

    // Buttons
    actionsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    btn: {
        flex: 1,
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        ...SHADOWS.button,
    },
    btnEdit: {
        backgroundColor: COLORS.primary,
    },
    btnDelete: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.error, // Red border
        shadowColor: COLORS.error,
        shadowOpacity: 0.1,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },

    // Items Card
    itemsCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...SHADOWS.card,
    },
    itemsCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    itemsIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemsCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    itemsCardSub: {
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});

