interface Frete {
    sedex: { price: number; days: number };
    pac: { price: number; days: number };
  }
  
// Dados de frete organizados por região e UF
export const freteData: { [uf: string]: { capital: Frete; interior: Frete } } = {
    // Região Norte
    'AC': {
        capital: { sedex: { price: 129.20, days: 13 }, pac: { price: 98.70, days: 17 } },
        interior: { sedex: { price: 129.20, days: 13 }, pac: { price: 98.70, days: 28 } },
    },
    'AP': {
        capital: { sedex: { price: 109.10, days: 16 }, pac: { price: 83.20, days: 28 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 28 } },
    },
    'AM': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 23 } },
        interior: { sedex: { price: 109.10, days: 15 }, pac: { price: 83.20, days: 28 } },
    },
    'PA': {
        capital: { sedex: { price: 94.90, days: 5 }, pac: { price: 60.80, days: 9 } },
        interior: { sedex: { price: 94.90, days: 15 }, pac: { price: 60.80, days: 28 } },
    },
    'RO': {
        capital: { sedex: { price: 109.10, days: 8 }, pac: { price: 83.20, days: 12 } },
        interior: { sedex: { price: 109.10, days: 8 }, pac: { price: 83.20, days: 26 } },
    },
    'RR': {
        capital: { sedex: { price: 129.20, days: 4 }, pac: { price: 98.70, days: 30 } },
        interior: { sedex: { price: 129.20, days: 16 }, pac: { price: 98.70, days: 30 } },
    },
    'TO': {
        capital: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 9 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 26 } },
    },
  
    // Região Nordeste
    'AL': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 129.20, days: 5 }, pac: { price: 98.70, days: 15 } },
    },
    'BA': {
        capital: { sedex: { price: 78.50, days: 2 }, pac: { price: 37.10, days: 6 } },
        interior: { sedex: { price: 78.50, days: 8 }, pac: { price: 37.10, days: 16 } },
    },
    'CE': {
        capital: { sedex: { price: 94.90, days: 4 }, pac: { price: 60.80, days: 8 } },
        interior: { sedex: { price: 94.90, days: 4 }, pac: { price: 60.80, days: 15 } },
    },
    'MA': {
        capital: { sedex: { price: 109.10, days: 6 }, pac: { price: 83.20, days: 10 } },
        interior: { sedex: { price: 109.10, days: 9 }, pac: { price: 83.20, days: 22 } },
    },
    'PB': {
        capital: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 9 } },
        interior: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 22 } },
    },
    'PE': {
        capital: { sedex: { price: 94.90, days: 4 }, pac: { price: 60.80, days: 8 } },
        interior: { sedex: { price: 94.90, days: 8 }, pac: { price: 60.80, days: 21 } },
    },
    'PI': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 21 } },
    },
    'RN': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 22 } },
    },
    'SE': {
        capital: { sedex: { price: 109.10, days: 4 }, pac: { price: 83.20, days: 8 } },
        interior: { sedex: { price: 109.10, days: 5 }, pac: { price: 83.20, days: 21 } },
    },
  
    // Região Centro-Oeste
    'DF': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 25.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 2 }, pac: { price: 25.80, days: 8 } },
    },
    'GO': {
        capital: { sedex: { price: 61.10, days: 3 }, pac: { price: 25.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 25.80, days: 8 } },
    },
    'MT': {
        capital: { sedex: { price: 78.50, days: 4 }, pac: { price: 30.10, days: 8 } },
        interior: { sedex: { price: 78.50, days: 6 }, pac: { price: 30.10, days: 12 } },
    },
    'MS': {
        capital: { sedex: { price: 61.10, days: 3 }, pac: { price: 25.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 4 }, pac: { price: 25.80, days: 12 } },
    },
  
    // Região Sudeste
    'ES': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 25.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 25.80, days: 10 } },
    },
    'MG': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 25.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 25.80, days: 8 } },
    },
    'RJ': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 25.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 4 }, pac: { price: 25.80, days: 8 } },
    },
    'SP': {
        capital: { sedex: { price: 29.00, days: 2 }, pac: { price: 15.50, days: 4 } },
        interior: { sedex: { price: 29.00, days: 4 }, pac: { price: 15.50, days: 6 } },
    },
  
    // Região Sul
    'PR': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 20.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 20.80, days: 9 } },
    },
    'RS': {
        capital: { sedex: { price: 61.10, days: 3 }, pac: { price: 20.80, days: 7 } },
        interior: { sedex: { price: 61.10, days: 4 }, pac: { price: 20.80, days: 9 } },
    },
    'SC': {
        capital: { sedex: { price: 61.10, days: 2 }, pac: { price: 20.80, days: 6 } },
        interior: { sedex: { price: 61.10, days: 3 }, pac: { price: 20.80, days: 9 } },
    },
};
  
// Mapeamento de capitais por região e UF
export const capitais: { [uf: string]: string } = {
    // Região Norte
    'AC': 'Rio Branco',
    'AP': 'Macapá',
    'AM': 'Manaus',
    'PA': 'Belém',
    'RO': 'Porto Velho',
    'RR': 'Boa Vista',
    'TO': 'Palmas',
  
    // Região Nordeste
    'AL': 'Maceió',
    'BA': 'Salvador',
    'CE': 'Fortaleza',
    'MA': 'São Luís',
    'PB': 'João Pessoa',
    'PE': 'Recife',
    'PI': 'Teresina',
    'RN': 'Natal',
    'SE': 'Aracaju',
  
    // Região Centro-Oeste
    'DF': 'Brasília',
    'GO': 'Goiânia',
    'MT': 'Cuiabá',
    'MS': 'Campo Grande',
  
    // Região Sudeste
    'ES': 'Vitória',
    'MG': 'Belo Horizonte',
    'RJ': 'Rio de Janeiro',
    'SP': 'São Paulo',
  
    // Região Sul
    'PR': 'Curitiba',
    'RS': 'Porto Alegre',
    'SC': 'Florianópolis',
};
  