import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { COLORS, FONTS, SHADOWS } from '../../../theme';
import { ItemType } from '../../items/item.types';
import { Hammer, Package, Wrench, X, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const TYPE_OPTIONS: { label: string; value: ItemType; icon: any; color: string; bg: string }[] = [
    { label: 'Material', value: 'MATERIAL', icon: Package, color: COLORS.info, bg: COLORS.infoBg },
    { label: 'Mão de Obra', value: 'MAO_DE_OBRA', icon: Hammer, color: COLORS.success, bg: COLORS.successBg },
    { label: 'Serviço', value: 'SERVICO', icon: Wrench, color: COLORS.warning, bg: COLORS.warningBg },
];

interface ItemFormModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { type: ItemType; name: string; qty: number; unit_price: number }) => void;
    initialData?: { type: ItemType; name: string; qty: number; unit_price: number } | null;
}

export default function ItemFormModal({ visible, onClose, onSave, initialData }: ItemFormModalProps) {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(60));

    const [type, setType] = useState<ItemType>('MATERIAL');
    const [name, setName] = useState('');
    const [qty, setQty] = useState('1');
    const [unitPrice, setUnitPrice] = useState('');

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setType(initialData.type);
                setName(initialData.name);
                setQty(String(initialData.qty));
                setUnitPrice(String(initialData.unit_price));
            } else {
                setType('MATERIAL');
                setName('');
                setQty('1');
                setUnitPrice('');
            }
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 60, duration: 160, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const parsedQty = parseFloat(qty.replace(',', '.')) || 0;
    const parsedPrice = parseFloat(unitPrice.replace(',', '.')) || 0;
    const lineTotal = parsedQty * parsedPrice;

    const isValid = name.trim().length > 0 && parsedQty > 0 && parsedPrice > 0;

    function handleSave() {
        if (!isValid) return;
        onSave({ type, name: name.trim(), qty: parsedQty, unit_price: parsedPrice });
    }

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.sheet,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            {initialData ? 'Editar Item' : 'Novo Item'}
                        </Text>
                        <Pressable onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color={COLORS.textSecondary} />
                        </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Type Selector */}
                        <Text style={styles.label}>TIPO</Text>
                        <View style={styles.typeRow}>
                            {TYPE_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const selected = type === opt.value;
                                return (
                                    <Pressable
                                        key={opt.value}
                                        onPress={() => setType(opt.value)}
                                        style={[
                                            styles.typeChip,
                                            selected && { backgroundColor: opt.bg, borderColor: opt.color, borderWidth: 2 },
                                        ]}
                                    >
                                        <Icon size={16} color={selected ? opt.color : COLORS.textSecondary} />
                                        <Text style={[styles.typeChipText, selected && { color: opt.color, fontWeight: '700' }]}>
                                            {opt.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Name */}
                        <Text style={[styles.label, { marginTop: 20 }]}>DESCRIÇÃO</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Ex: Cimento 50kg, Pedreiro, Pintura..."
                            placeholderTextColor={COLORS.textSecondary}
                            style={styles.input}
                        />

                        {/* Qty + Price */}
                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>QUANTIDADE</Text>
                                <TextInput
                                    value={qty}
                                    onChangeText={setQty}
                                    placeholder="1"
                                    placeholderTextColor={COLORS.textSecondary}
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={{ flex: 1.5 }}>
                                <Text style={styles.label}>PREÇO UNITÁRIO (R$)</Text>
                                <TextInput
                                    value={unitPrice}
                                    onChangeText={setUnitPrice}
                                    placeholder="0,00"
                                    placeholderTextColor={COLORS.textSecondary}
                                    keyboardType="decimal-pad"
                                    style={styles.input}
                                />
                            </View>
                        </View>

                        {/* Live total */}
                        {parsedQty > 0 && parsedPrice > 0 && (
                            <View style={styles.totalPreview}>
                                <Text style={styles.totalPreviewLabel}>Total do item</Text>
                                <Text style={styles.totalPreviewValue}>
                                    R$ {lineTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </Text>
                            </View>
                        )}

                        {/* Save */}
                        <Pressable
                            onPress={handleSave}
                            disabled={!isValid}
                            style={({ pressed }) => [
                                styles.saveBtn,
                                !isValid && styles.saveBtnDisabled,
                                pressed && isValid && { opacity: 0.9 },
                            ]}
                        >
                            <Check size={20} color={COLORS.white} strokeWidth={3} />
                            <Text style={styles.saveBtnText}>Salvar Item</Text>
                        </Pressable>
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 40,
        ...SHADOWS.card,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerTitle: {
        fontFamily: FONTS.bold,
        fontSize: 20,
        color: COLORS.textPrimary,
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontFamily: FONTS.bold,
        fontSize: 11,
        color: COLORS.textSecondary,
        marginBottom: 8,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    typeRow: {
        flexDirection: 'row',
        gap: 8,
    },
    typeChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    typeChipText: {
        fontFamily: FONTS.semiBold,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    input: {
        backgroundColor: COLORS.cardAlt,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
        paddingHorizontal: 4,
        height: 50,
        fontFamily: FONTS.semiBold,
        fontSize: 16,
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        marginTop: 20,
    },
    totalPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        marginBottom: 4,
    },
    totalPreviewLabel: {
        fontFamily: FONTS.semiBold,
        fontSize: 14,
        color: COLORS.primary,
    },
    totalPreviewValue: {
        fontFamily: FONTS.extraBold,
        fontSize: 18,
        color: COLORS.primary,
    },
    saveBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 20,
        ...SHADOWS.button,
    },
    saveBtnDisabled: {
        backgroundColor: COLORS.border,
        shadowOpacity: 0,
    },
    saveBtnText: {
        fontFamily: FONTS.bold,
        color: COLORS.white,
        fontSize: 17,
    },
});
