import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { createBudget } from '../budget.repository';
import { useNavigation } from '@react-navigation/native';

export default function BudgetForm() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');

    async function handleSave() {
        if (!title || !client) return;

        await createBudget({
            title,
            client_name: client
        });

        navigation.goBack();
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text>Título</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                style={{ borderWidth: 1, padding: 12, marginBottom: 16 }}
            />

            <Text>Cliente</Text>
            <TextInput
                value={client}
                onChangeText={setClient}
                style={{ borderWidth: 1, padding: 12, marginBottom: 16 }}
            />

            <Pressable
                onPress={handleSave}
                style={{ backgroundColor: '#111', padding: 16, borderRadius: 12 }}
            >
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                    Salvar
                </Text>
            </Pressable>
        </View>
    );
}
