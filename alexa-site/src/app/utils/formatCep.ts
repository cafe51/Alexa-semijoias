export const formatCep = (cep: string) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length <= 5) {
        return digits;
    }
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};