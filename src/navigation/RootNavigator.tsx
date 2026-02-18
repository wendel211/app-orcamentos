import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetsList from '../modules/budgets/screens/BudgetsList';
import BudgetForm from '../modules/budgets/screens/BudgetForm';
import BudgetDetails from '../modules/budgets/screens/BudgetDetails';
import BudgetItems from '../modules/budgets/screens/BudgetItems';
import Dashboard from '../modules/budgets/screens/Dashboard';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: COLORS.white,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 18,
                    },
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: COLORS.background,
                    },
                }}
            >
                <Stack.Screen
                    name="BudgetsList"
                    component={BudgetsList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BudgetForm"
                    component={BudgetForm}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BudgetDetails"
                    component={BudgetDetails}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="BudgetItems"
                    component={BudgetItems}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
