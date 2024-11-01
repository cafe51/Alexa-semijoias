import { capitais, freteData } from './freteData';

// Função que retorna o frete para a cidade e estado especificados
export default function getShippingOptions(cidade: string, uf: string): { id: string, name: string, price: number, days: number }[] {
    const estado = freteData[uf];
    if (!estado || Object.keys(capitais).includes(uf) === false) {
        throw new Error(`UF inválida: ${uf}`);
    }

    // Verifica se a cidade é capital ou interior
    const isCapital = capitais[uf].toLowerCase() === cidade.toLowerCase();
    const frete = isCapital ? estado.capital : estado.interior;

    console.log('AAAAAAAAA cidade', cidade);
    console.log('AAAAAAAAA frete', frete);

    console.log('AAAAAAAAA isCapital', isCapital);


    return [
        { id: 'sedex', name: 'Sedex', price: frete.sedex.price, days: frete.sedex.days },
        { id: 'pac', name: 'PAC', price: frete.pac.price, days: frete.pac.days },
    ];
}

// Exemplo de uso:
// console.log(getShippingOptions('São Paulo', 'SP'));
// console.log(getShippingOptions('Campinas', 'SP'));
// console.log(getShippingOptions('Maceió', 'AL'));
