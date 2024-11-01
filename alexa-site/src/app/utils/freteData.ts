interface Frete {
    sedex: { price: number, days: number },
    pac: { price: number, days: number }
}

export const freteData: { [uf: string]: { capital: Frete, interior: Frete } } = {
    'AC': {
        capital: { sedex: { price: 129.20, days: 13 }, pac: { price: 98.70, days: 17 } },
        interior: { sedex: { price: 129.20, days: 13 }, pac: { price: 98.70, days: 28 } },
    },
    'AL': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 129.20, days: 5 }, pac: { price: 98.70, days: 15 } },
    },
    'AP': {
        capital: { sedex: { price: 109.10, days: 16 }, pac: { price: 83.20, days: 28 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 28 } },
    },
    'AM': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 23 } },
        interior: { sedex: { price: 109.10, days: 15 }, pac: { price: 83.20, days: 28 } },
    },
    'BA': {
        capital: { sedex: { price: 78.50, days: 2 }, pac: { price: 37.10, days: 6 } },
        interior: { sedex: { price: 78.50, days: 8 }, pac: { price: 37.10, days: 16 } },
    },
    'CE': {
        capital: { sedex: { price: 94.90, days: 4 }, pac: { price: 60.80, days: 8 } },
        interior: { sedex: { price: 94.90, days: 4 }, pac: { price: 60.80, days: 15 } },
    },
    'DF': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 10 } },
    },
    'ES': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 10 } },
    },
    'GO': {
        capital: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 10 } },
    },
    'MA': {
        capital: { sedex: { price: 109.10, days: 6 }, pac: { price: 83.20, days: 10 } },
        interior: { sedex: { price: 109.10, days: 9 }, pac: { price: 83.20, days: 22 } },
    },
    'MT': {
        capital: { sedex: { price: 78.50, days: 4 }, pac: { price: 37.10, days: 8 } },
        interior: { sedex: { price: 78.50, days: 6 }, pac: { price: 37.10, days: 15 } },
    },
    'MS': {
        capital: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 4 }, pac: { price: 30.80, days: 15 } },
    },
    'MG': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 12 } },
    },
    'PA': {
        capital: { sedex: { price: 94.90, days: 5 }, pac: { price: 60.80, days: 9 } },
        interior: { sedex: { price: 94.90, days: 15 }, pac: { price: 60.80, days: 28 } },
    },
    'PB': {
        capital: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 9 } },
        interior: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 22 } },
    },
    'PR': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 15 } },
    },
    'PE': {
        capital: { sedex: { price: 94.90, days: 4 }, pac: { price: 60.80, days: 8 } },
        interior: { sedex: { price: 94.90, days: 8 }, pac: { price: 60.80, days: 21 } },
    },
    'PI': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 21 } },
    },
    'RJ': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 4 }, pac: { price: 30.80, days: 12 } },
    },
    'RN': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 22 } },
    },
    'RS': {
        capital: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 4 }, pac: { price: 30.80, days: 16 } },
    },
    'RO': {
        capital: { sedex: { price: 109.10, days: 8 }, pac: { price: 83.20, days: 12 } },
        interior: { sedex: { price: 109.10, days: 8 }, pac: { price: 83.20, days: 26 } },
    },
    'RR': {
        capital: { sedex: { price: 129.20, days: 4 }, pac: { price: 98.70, days: 30 } },
        interior: { sedex: { price: 129.20, days: 16 }, pac: { price: 98.70, days: 30 } },
    },
    'SC': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 30.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 30.80, days: 16 } },
    },
    'SP': {
        capital: { sedex: { price: 29.00, days: 2 }, pac: { price: 25.50, days: 6 } },
        interior: { sedex: { price: 29.00, days: 4 }, pac: { price: 25.50, days: 8 } },
    },
    'SE': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 21 } },
    },
    'TO': {
        capital: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 9 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 26 } },
    },
};

export const capitais: { [uf: string]: string } = {
    'AC': 'Rio Branco',
    'AL': 'Maceió',
    'AP': 'Macapá',
    'AM': 'Manaus',
    'BA': 'Salvador',
    'CE': 'Fortaleza',
    'DF': 'Brasília',
    'ES': 'Vitória',
    'GO': 'Goiânia',
    'MA': 'São Luís',
    'MT': 'Cuiabá',
    'MS': 'Campo Grande',
    'MG': 'Belo Horizonte',
    'PA': 'Belém',
    'PB': 'João Pessoa',
    'PR': 'Curitiba',
    'PE': 'Recife',
    'PI': 'Teresina',
    'RJ': 'Rio de Janeiro',
    'RN': 'Natal',
    'RS': 'Porto Alegre',
    'RO': 'Porto Velho',
    'RR': 'Boa Vista',
    'SC': 'Florianópolis',
    'SP': 'São Paulo',
    'SE': 'Aracaju',
    'TO': 'Palmas',
};