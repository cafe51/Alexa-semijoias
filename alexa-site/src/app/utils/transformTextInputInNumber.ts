export function transformTextInputInNumber(input: string, callBack: (input: number) => void) {
    // Remove "R$" e outros caracteres não numéricos
    const numericValue = input.replace(/[^\d,-]/g, '').replace(',', '.');

    // Converte para número, mas mantém o valor como string enquanto digita
    const value = numericValue !== '' ? parseFloat(numericValue) : 0;

    callBack(value);
}