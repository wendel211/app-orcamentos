import axios from 'axios';

// Captura as variáveis do ambiente Expo
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const apiKey = process.env.EXPO_PUBLIC_API_KEY;

// LOGS DE DEBUG (Confira no terminal do Expo se os valores aparecem)
if (__DEV__) {
    console.log("--- CONFIGURAÇÃO DA API ---");
    console.log("URL:", apiUrl || "NÃO DEFINIDA");
    console.log("KEY:", apiKey ? "DEFINIDA (****)" : "NÃO DEFINIDA");
}

if (!apiUrl) {
    throw new Error(
        'EXPO_PUBLIC_API_URL não definida. ' +
        'Verifique se o seu arquivo .env tem as variáveis com o prefixo EXPO_PUBLIC_.'
    );
}

export const api = axios.create({
    baseURL: apiUrl,
    timeout: 15000, // 15 segundos para evitar travamentos em obras com sinal ruim
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': apiKey // O cabeçalho deve ser idêntico ao que o backend espera
    }
});

// Adicionamos um interceptor para garantir que a chave vá em TODAS as requisições
api.interceptors.request.use((config) => {
    if (apiKey) {
        config.headers['x-api-key'] = apiKey;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});