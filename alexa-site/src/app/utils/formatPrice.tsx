//app/utils/formatPrice.tsx

export function formatPrice(valor: number | null | undefined): string {
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, // Garante sempre duas casas decimais
    });

    if (!valor) return formatador.format(0);

    return formatador.format(valor);
}

export function formatInputMode(value: string, unitType: 'currency' | 'dimension' | 'weight'): string {
    // Remove todos os caracteres que não sejam dígitos
    const numericValue = value.replace(/\D/g, '');

    // Permite que o valor seja "0" durante a digitação
    if (numericValue === '') {
        switch (unitType) {
        case 'currency':
            return 'R$ 0,00';
        case 'dimension':
            return '0,00 cm';
        case 'weight':
            return '0,00 g';
        }
    }

    // Adiciona zeros à esquerda conforme necessário para garantir pelo menos 3 dígitos
    const paddedValue = numericValue.padStart(3, '0');

    // Converte o valor para inteiro e formata como moeda
    const intValue = parseInt(paddedValue, 10);
    const formattedValue = (intValue / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).replace('R$', '').trim(); // Remove o símbolo de moeda "R$" para todas as formatações

    // Adiciona o símbolo apropriado com base no tipo
    switch (unitType) {
    case 'currency':
        return `R$ ${formattedValue}`;
    case 'dimension':
        return `${formattedValue} cm`;
    case 'weight':
        return `${formattedValue} g`;
    }
}
