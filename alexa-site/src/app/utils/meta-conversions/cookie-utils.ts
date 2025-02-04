'use client';

/**
 * Gera um número aleatório para o fbp no formato especificado pela Meta
 */
const generateRandomNumber = (): string => {
    return Math.floor(Math.random() * 2147483647).toString();
};

/**
 * Obtém o timestamp atual em milissegundos
 */
const getCurrentTimestamp = (): number => {
    return Date.now();
};

/**
 * Extrai o parâmetro fbclid da URL atual
 */
export const getFbclid = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('fbclid');
};

/**
 * Formata o fbclid no formato requerido pela Meta
 * Formato: fb.1.{timestamp}.{fbclid}
 */
export const formatFbc = (fbclid: string): string => {
    return `fb.1.${getCurrentTimestamp()}.${fbclid}`;
};

/**
 * Gera um novo valor fbp no formato requerido pela Meta
 * Formato: fb.1.{timestamp}.{random_number}
 */
export const generateFbp = (): string => {
    return `fb.1.${getCurrentTimestamp()}.${generateRandomNumber()}`;
};

/**
 * Define um cookie com o nome e valor especificados
 */
export const setCookie = (name: string, value: string, days = 90): void => {
    if (typeof window === 'undefined') return;

    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * Obtém o valor de um cookie pelo nome
 */
export const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null;

    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

/**
 * Gerencia o cookie _fbc:
 * - Verifica se há um fbclid na URL
 * - Se houver, cria ou atualiza o cookie _fbc
 * - Retorna o valor atual do cookie _fbc
 */
export const manageFbc = (): string | null => {
    const fbclid = getFbclid();
    if (fbclid) {
        const fbc = formatFbc(fbclid);
        setCookie('_fbc', fbc);
        return fbc;
    }
    return getCookie('_fbc');
};

/**
 * Gerencia o cookie _fbp:
 * - Verifica se já existe
 * - Se não existir, cria um novo
 * - Retorna o valor atual
 */
export const manageFbp = (): string => {
    let fbp = getCookie('_fbp');
    if (!fbp) {
        fbp = generateFbp();
        setCookie('_fbp', fbp);
    }
    return fbp;
};
