import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listBudgets } from '../budget.repository';

export default function BudgetsList() {
    const navigation = useNavigation();
    const [data, setData] = useState<any[]>([]);

    const load = async () => {
        const result = await listBudgets();
        setData(result);
    };

    useFocusEffect(
        useCallback(() => {
            load();
        }, [])
    );

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Pressable
                onPress={() => (navigation as any).navigate('BudgetForm')}
                style={{
                    backgroundColor: '#111',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 16
                }}
            >
                <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                    + Novo Orçamento
                </Text>
            </Pressable>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            (navigation as any).navigate('BudgetDetails', { id: item.id })
                        }
                        style={{
                            padding: 16,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: '#ddd',
                            marginBottom: 12
                        }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            {item.title}
                        </Text>
                        <Text>{item.client_name}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
