import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getBudget } from '../budget.repository';

export default function BudgetDetails() {
    const route = useRoute();
    const { id } = route.params as any;
    const [budget, setBudget] = useState<any>(null);

    useEffect(() => {
        getBudget(id).then(setBudget);
    }, []);

    if (!budget) return null;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {budget.title}
            </Text>
            <Text>{budget.client_name}</Text>
            <Text>Sincronizado: {budget.synced ? 'Sim' : 'Não'}</Text>
        </View>
    );
}
