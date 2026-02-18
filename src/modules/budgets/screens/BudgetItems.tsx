import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    SafeAreaView,
    Platform,
    TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../../theme';
import { listItems, createItem, deleteItem } from '../../items/item.repository';
import { updateBudget, getBudget } from '../budget.repository';
import { Item, ItemType } from '../../items/item.types';
import ItemFormModal from '../components/ItemFormModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {
    ChevronLeft,
    Plus,
    Trash2,
    Package,
    Hammer,
    Wrench,
    Tag,
    Percent,
    DollarSign,
} from 'lucide-react-native';

const TYPE_META: Record<ItemType, { label: string; icon: any; color: string; bg: string }> = {
    MATERIAL: { label: 'Material', icon: Package, color: '#1E40AF', bg: '#DBEAFE' },
    MAO_DE_OBRA: { label: 'Mão de Obra', icon: Hammer, color: '#166534', bg: '#DCFCE7' },
    SERVICO: { label: 'Serviço', icon: Wrench, color: '#92400E', bg: '#FEF3C7' },
};

function fmt(value: number) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BudgetItems() {
    const navigation = useNavigation();
    const route = useRoute();
    const { budgetId } = route.params as { budgetId: string };

    const [items, setItems] = useState<Item[]>([]);
    const [discount, setDiscount] = useState('0');
    const [extraFee, setExtraFee] = useState('0');
    const [modalVisible, setModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const load = async () => {
        const [loadedItems, budget] = await Promise.all([
            listItems(budgetId),
            getBudget(budgetId),
        ]);
        setItems(loadedItems);
        if (budget) {
            setDiscount(String(budget.discount ?? 0));
            setExtraFee(String(budget.extra_fee ?? 0));
        }
    };

    useFocusEffect(
        useCallback(() => {
            load();
        }, [budgetId])
    );

    async function handleAddItem(data: { type: ItemType; name: string; qty: number; unit_price: number }) {
        await createItem({ budget_id: budgetId, ...data });
        setModalVisible(false);
        await load();
    }

    function handleDeleteItem(item: Item) {
        setItemToDelete(item);
    }

    async function confirmDeleteItem() {
        if (!itemToDelete) return;
        await deleteItem(itemToDelete.id);
        setItemToDelete(null);
        await load();
    }

    async function handleSaveTotals() {
        const d = parseFloat(discount.replace(',', '.')) || 0;
        const e = parseFloat(extraFee.replace(',', '.')) || 0;
        await updateBudget(budgetId, { discount: d, extra_fee: e });
    }

    // Calculations
    const subtotalMaterial = items
        .filter(i => i.type === 'MATERIAL')
        .reduce((s, i) => s + i.qty * i.unit_price, 0);
    const subtotalMao = items
        .filter(i => i.type === 'MAO_DE_OBRA')
        .reduce((s, i) => s + i.qty * i.unit_price, 0);
    const subtotalServico = items
        .filter(i => i.type === 'SERVICO')
        .reduce((s, i) => s + i.qty * i.unit_price, 0);
    const subtotal = subtotalMaterial + subtotalMao + subtotalServico;

    const discountVal = parseFloat(discount.replace(',', '.')) || 0;
    const extraFeeVal = parseFloat(extraFee.replace(',', '.')) || 0;
    const total = subtotal - discountVal + extraFeeVal;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={({ pressed }) => [styles.backButton, pressed && { backgroundColor: '#F1F5F9' }]}
                >
                    <ChevronLeft size={28} color={COLORS.primary} strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.headerTitle}>Itens & Cálculos</Text>
                <Pressable
                    onPress={() => setModalVisible(true)}
                    style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.85 }]}
                >
                    <Plus size={20} color={COLORS.white} strokeWidth={3} />
                </Pressable>
            </View>

            <FlatList
                data={items}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Tag size={40} color={COLORS.border} />
                        <Text style={styles.emptyText}>Nenhum item ainda</Text>
                        <Text style={styles.emptySubtext}>Toque em + para adicionar materiais, mão de obra ou serviços</Text>
                    </View>
                }
                ListFooterComponent={
                    <>
                        {/* Category Summary */}
                        {subtotal > 0 && (
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>Resumo por Categoria</Text>

                                {subtotalMaterial > 0 && (
                                    <View style={styles.summaryRow}>
                                        <View style={[styles.summaryDot, { backgroundColor: '#DBEAFE' }]}>
                                            <Package size={14} color="#1E40AF" />
                                        </View>
                                        <Text style={styles.summaryLabel}>Material</Text>
                                        <Text style={styles.summaryValue}>R$ {fmt(subtotalMaterial)}</Text>
                                    </View>
                                )}
                                {subtotalMao > 0 && (
                                    <View style={styles.summaryRow}>
                                        <View style={[styles.summaryDot, { backgroundColor: '#DCFCE7' }]}>
                                            <Hammer size={14} color="#166534" />
                                        </View>
                                        <Text style={styles.summaryLabel}>Mão de Obra</Text>
                                        <Text style={styles.summaryValue}>R$ {fmt(subtotalMao)}</Text>
                                    </View>
                                )}
                                {subtotalServico > 0 && (
                                    <View style={styles.summaryRow}>
                                        <View style={[styles.summaryDot, { backgroundColor: '#FEF3C7' }]}>
                                            <Wrench size={14} color="#92400E" />
                                        </View>
                                        <Text style={styles.summaryLabel}>Serviço</Text>
                                        <Text style={styles.summaryValue}>R$ {fmt(subtotalServico)}</Text>
                                    </View>
                                )}

                                <View style={styles.divider} />

                                <View style={styles.summaryRow}>
                                    <Text style={[styles.summaryLabel, { fontWeight: '700', color: COLORS.textPrimary }]}>Subtotal</Text>
                                    <Text style={[styles.summaryValue, { fontWeight: '700', color: COLORS.textPrimary }]}>R$ {fmt(subtotal)}</Text>
                                </View>
                            </View>
                        )}

                        {/* Discount & Extra Fee */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Ajustes</Text>

                            <View style={styles.adjustRow}>
                                <View style={[styles.adjustIcon, { backgroundColor: '#DCFCE7' }]}>
                                    <Percent size={16} color="#166534" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.adjustLabel}>Desconto (R$)</Text>
                                    <TextInput
                                        value={discount}
                                        onChangeText={setDiscount}
                                        onBlur={handleSaveTotals}
                                        keyboardType="decimal-pad"
                                        style={styles.adjustInput}
                                        placeholder="0,00"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                </View>
                            </View>

                            <View style={[styles.adjustRow, { marginTop: 12 }]}>
                                <View style={[styles.adjustIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <DollarSign size={16} color="#92400E" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.adjustLabel}>Taxa Extra / Margem (R$)</Text>
                                    <TextInput
                                        value={extraFee}
                                        onChangeText={setExtraFee}
                                        onBlur={handleSaveTotals}
                                        keyboardType="decimal-pad"
                                        style={styles.adjustInput}
                                        placeholder="0,00"
                                        placeholderTextColor={COLORS.textSecondary}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Grand Total */}
                        <View style={styles.totalCard}>
                            <Text style={styles.totalLabel}>VALOR TOTAL DO ORÇAMENTO</Text>
                            <Text style={styles.totalValue}>R$ {fmt(total)}</Text>
                            {discountVal > 0 && (
                                <Text style={styles.totalNote}>Desconto de R$ {fmt(discountVal)} aplicado</Text>
                            )}
                        </View>
                    </>
                }
                renderItem={({ item }) => {
                    const meta = TYPE_META[item.type];
                    const Icon = meta.icon;
                    const lineTotal = item.qty * item.unit_price;

                    return (
                        <View style={styles.itemCard}>
                            <View style={[styles.itemIconBox, { backgroundColor: meta.bg }]}>
                                <Icon size={18} color={meta.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemMeta}>
                                    {item.qty} × R$ {fmt(item.unit_price)}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.itemTotal}>R$ {fmt(lineTotal)}</Text>
                                <View style={[styles.typeBadge, { backgroundColor: meta.bg }]}>
                                    <Text style={[styles.typeBadgeText, { color: meta.color }]}>{meta.label}</Text>
                                </View>
                            </View>
                            <Pressable
                                onPress={() => handleDeleteItem(item)}
                                style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.7 }]}
                            >
                                <Trash2 size={16} color={COLORS.error} />
                            </Pressable>
                        </View>
                    );
                }}
            />

            <ItemFormModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleAddItem}
            />

            <ConfirmationModal
                visible={!!itemToDelete}
                title="Remover Item"
                message={`Deseja remover "${itemToDelete?.name}" do orçamento? Essa ação não pode ser desfeita.`}
                confirmText="Sim, remover"
                cancelText="Cancelar"
                onConfirm={confirmDeleteItem}
                onCancel={() => setItemToDelete(null)}
                type="danger"
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.button,
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    emptyBox: {
        alignItems: 'center',
        paddingVertical: 48,
        gap: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 20,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        gap: 12,
        ...SHADOWS.card,
    },
    itemIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    itemMeta: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    itemTotal: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    deleteBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    summaryDot: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryLabel: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    adjustRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    adjustIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    adjustLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    adjustInput: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
        paddingVertical: 4,
        paddingHorizontal: 0,
    },
    totalCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        ...SHADOWS.button,
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
        marginBottom: 8,
    },
    totalValue: {
        fontSize: 36,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: -1,
    },
    totalNote: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 6,
    },
});
