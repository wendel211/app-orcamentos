import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BudgetsList from '../modules/budgets/screens/BudgetsList';
import BudgetForm from '../modules/budgets/screens/BudgetForm';
import BudgetDetails from '../modules/budgets/screens/BudgetDetails';
import BudgetItems from '../modules/budgets/screens/BudgetItems';
import Dashboard from '../modules/budgets/screens/Dashboard';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';
import { useAuth } from '../modules/auth/contexts/AuthContext';
import { COLORS } from '../theme';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, loading } = useAuth();
    const isAuthenticated = !!user;

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={isAuthenticated ? "BudgetsList" : "Login"}
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
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
