import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { createBudget } from '../budget.repository';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS } from '../../../theme';

export default function BudgetForm() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');

    async function handleSave() {
        if (!title || !client) return;

        await createBudget({
            title,
            client_name: client,
        });

        navigation.goBack();
    }

    const isValid = title.trim().length > 0 && client.trim().length > 0;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>📝 Dados do Orçamento</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Título do orçamento</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Reforma cozinha"
                            placeholderTextColor={COLORS.textSecondary}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome do cliente</Text>
                        <TextInput
                            value={client}
                            onChangeText={setClient}
                            placeholder="Ex: João da Silva"
                            placeholderTextColor={COLORS.textSecondary}
                            style={styles.input}
                        />
                    </View>
                </View>

                {/* Save Button */}
                <Pressable
                    onPress={handleSave}
                    disabled={!isValid}
                    style={({ pressed }) => [
                        styles.saveBtn,
                        !isValid && styles.saveBtnDisabled,
                        pressed && isValid && { opacity: 0.85 },
                    ]}
                >
                    <Text style={styles.saveBtnText}>
                        ✓  Salvar Orçamento
                    </Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },

    // Form Card
    formCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        ...SHADOWS.card,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 24,
    },

    // Inputs
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: COLORS.textPrimary,
    },

    // Save Button
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveBtnDisabled: {
        backgroundColor: COLORS.border,
    },
    saveBtnText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 17,
    },
});
