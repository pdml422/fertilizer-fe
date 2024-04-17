import { APICore } from './apiCore';

const api = new APICore();

function login(params) {
    const baseUrl = '/auth/login';
    return api.post(`${baseUrl}`, params);
}

function register(params) {
    const baseUrl = '/auth/register';
    return api.post(`${baseUrl}`, params);
}

export { login, register };
