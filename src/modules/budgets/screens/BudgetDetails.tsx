import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getBudget } from '../budget.repository';
import { COLORS, SHADOWS } from '../../../theme';

export default function BudgetDetails() {
    const route = useRoute();
    const { id } = route.params as any;
    const [budget, setBudget] = useState<any>(null);

    useEffect(() => {
        getBudget(id).then(setBudget);
    }, []);

    if (!budget) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Main Info Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📋 Informações</Text>

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
                            <Text style={styles.infoLabel}>Endereço</Text>
                            <Text style={styles.infoValue}>{budget.address}</Text>
                        </View>
                    </>
                ) : null}
            </View>

            {/* Status Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📡 Status</Text>

                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: budget.synced
                                    ? '#E8F8F0'
                                    : '#FEF3E2',
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.statusDot,
                                {
                                    backgroundColor: budget.synced
                                        ? COLORS.success
                                        : COLORS.warning,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.statusLabel,
                                {
                                    color: budget.synced
                                        ? COLORS.success
                                        : COLORS.warning,
                                },
                            ]}
                        >
                            {budget.synced ? 'Sincronizado' : 'Pendente de sincronização'}
                        </Text>
                    </View>
                </View>

                {budget.created_at ? (
                    <>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Criado em</Text>
                            <Text style={styles.infoValue}>
                                {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                            </Text>
                        </View>
                    </>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },

    // Card
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        ...SHADOWS.card,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16,
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

    // Status
    statusContainer: {
        marginBottom: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
});
