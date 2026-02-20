import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
    throw new Error(
        'EXPO_PUBLIC_API_URL não definida. ' +
        'Crie o arquivo .env.development (dev) ou .env.production (prod).'
    );
}

export const api = axios.create({
    baseURL: apiUrl,
});
