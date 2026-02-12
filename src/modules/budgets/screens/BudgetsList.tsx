import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { listBudgets } from '../budget.repository';
import { syncData } from '../../sync/sync.service';

export default function BudgetsList() {
    const navigation = useNavigation();
    const [data, setData] = useState<any[]>([]);
    const [syncing, setSyncing] = useState(false);

    const load = async () => {
        const result = await listBudgets();
        setData(result);
    };

    const handleSync = async () => {
        setSyncing(true);
        const result = await syncData();
        setSyncing(false);

        if (result.success) {
            Alert.alert('Sucesso', 'Sincronização concluída!');
            load();
        } else {
            Alert.alert('Erro', 'Falha ao sincronizar. Verifique sua conexão.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            load();
        }, [])
    );

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                <Pressable
                    onPress={() => (navigation as any).navigate('BudgetForm')}
                    style={{
                        flex: 1,
                        backgroundColor: '#111',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        + Novo Orçamento
                    </Text>
                </Pressable>

                <Pressable
                    onPress={handleSync}
                    disabled={syncing}
                    style={{
                        flex: 1,
                        backgroundColor: '#007AFF',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {syncing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            Sincronizar
                        </Text>
                    )}
                </Pressable>
            </View>

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
                            marginBottom: 12,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                {item.title}
                            </Text>
                            <Text>{item.client_name}</Text>
                        </View>
                        {item.synced ? (
                            <Text style={{ color: 'green', fontSize: 12 }}>☁️ OK</Text>
                        ) : (
                            <Text style={{ color: 'orange', fontSize: 12 }}>⚠️ Pendente</Text>
                        )}
                    </Pressable>
                )}
            />
        </View>
    );
}
