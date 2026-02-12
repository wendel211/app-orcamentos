import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetsList from '../modules/budgets/screens/BudgetsList';
import BudgetForm from '../modules/budgets/screens/BudgetForm';
import BudgetDetails from '../modules/budgets/screens/BudgetDetails';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="BudgetsList" component={BudgetsList} options={{ title: "Orçamentos" }} />
                <Stack.Screen name="BudgetForm" component={BudgetForm} options={{ title: "Novo Orçamento" }} />
                <Stack.Screen name="BudgetDetails" component={BudgetDetails} options={{ title: "Detalhes" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
