// src/components/MetasCalculadora.tsx
'use client'; // Necessário para indicar que é um Client Component no Next.js App Router

import React, { useState, useMemo } from 'react';

// Função auxiliar para formatar moeda (Reais)
const formatCurrency = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) {
        return 'R$ ---';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Função auxiliar para formatar porcentagem
const formatPercentage = (value: number): string => {
    if (isNaN(value) || !isFinite(value)) {
        return '---%';
    }
    // Multiplica por 100 para exibir como porcentagem (ex: ROAS 3.5 vira 350%)
    return `${(value * 100).toFixed(1).replace('.', ',')}%`;
};

const MetasCalculadora: React.FC = () => {
    // Estados para os inputs do usuário
    const [ticketMedio, setTicketMedio] = useState<number>(120); // Seu valor inicial
    const [margemLucro, setMargemLucro] = useState<number>(50); // Sua margem inicial em %

    // --- Cálculos Memorizados ---
    const {
        lucroBrutoPorVenda,
        breakEvenCPA,
        breakEvenROAS,
        idealROAS, // Definimos uma meta ideal (ex: 3.5x ou 4x)
        idealCPA,
    } = useMemo(() => {
        const margemDecimal = margemLucro / 100;
        const lucroBruto = ticketMedio * margemDecimal;

        // Break-Even (Ponto de Equilíbrio)
        const cpaBreakEven = lucroBruto > 0 ? lucroBruto : 0;
        const roasBreakEven = margemDecimal > 0 ? 1 / margemDecimal : Infinity; // ROAS = Receita / Custo = TicketMedio / CPA = TicketMedio / (TicketMedio * Margem) = 1 / Margem

        // Metas Ideais (Exemplo: buscar ROAS 3.5x)
        // Você pode ajustar esse multiplicador conforme sua estratégia
        const roasIdealTarget = 3.5;
        const cpaIdeal = ticketMedio > 0 && roasIdealTarget > 0 ? ticketMedio / roasIdealTarget : 0;

        return {
            lucroBrutoPorVenda: lucroBruto,
            breakEvenCPA: cpaBreakEven,
            breakEvenROAS: roasBreakEven,
            idealROAS: roasIdealTarget,
            idealCPA: cpaIdeal,
        };
    }, [ticketMedio, margemLucro]);

    // --- Handlers para Mudança nos Inputs ---
    const handleTicketMedioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setTicketMedio(isNaN(value) ? 0 : value);
    };

    const handleMargemLucroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setMargemLucro(isNaN(value) ? 0 : value);
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Calculadora de Metas de Performance
            </h2>

            { /* Seção de Inputs */ }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label
                        htmlFor="ticketMedio"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
            Ticket Médio (R$)
                    </label>
                    <input
                        type="number"
                        id="ticketMedio"
                        value={ ticketMedio === 0 ? '' : ticketMedio } // Evita mostrar 0 no input vazio
                        onChange={ handleTicketMedioChange }
                        step="0.01" // Permite centavos
                        min="0"
                        placeholder="Ex: 120.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    />
                </div>
                <div>
                    <label
                        htmlFor="margemLucro"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
            Margem de Lucro Bruta (%)
                    </label>
                    <input
                        type="number"
                        id="margemLucro"
                        value={ margemLucro === 0 ? '' : margemLucro }
                        onChange={ handleMargemLucroChange }
                        step="0.1" // Permite decimais na margem
                        min="0"
                        max="100"
                        placeholder="Ex: 50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    />
                    <p className="text-xs text-gray-500 mt-1">Insira apenas o número (ex: 50 para 50%)</p>
                </div>
            </div>

            { /* Seção de Resultados (Metas) */ }
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-700 mb-5 text-center border-b pb-3">
          Suas Metas Calculadas
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    { /* Lucro Bruto por Venda */ }
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Lucro Bruto por Venda</h4>
                        <p className="text-2xl font-bold text-gray-800">
                            { formatCurrency(lucroBrutoPorVenda) }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">(Antes do custo de anúncio)</p>
                    </div>

                    { /* CPA Break-Even */ }
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h4 className="text-sm font-medium text-yellow-800 mb-1">CPA Máximo (Break-Even)</h4>
                        <p className="text-2xl font-bold text-yellow-700">
                            { formatCurrency(breakEvenCPA) }
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">(Custo máximo por venda para não ter prejuízo)</p>
                    </div>

                    { /* ROAS Break-Even */ }
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h4 className="text-sm font-medium text-yellow-800 mb-1">ROAS Mínimo (Break-Even)</h4>
                        <p className="text-2xl font-bold text-yellow-700">
                            { isFinite(breakEvenROAS) ? formatPercentage(breakEvenROAS) : 'N/A' }
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">(Retorno mínimo para não ter prejuízo)</p>
                    </div>

                    { /* CPA Ideal */ }
                    <div className="bg-green-50 p-4 rounded-md border border-green-200 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h4 className="text-sm font-medium text-green-800 mb-1">CPA Ideal (Meta)</h4>
                        <p className="text-2xl font-bold text-green-700">
                            { formatCurrency(idealCPA) }
                        </p>
                        <p className="text-xs text-green-600 mt-1">{ `(Visando ROAS de ${formatPercentage(idealROAS)})` }</p>
                    </div>

                    { /* ROAS Ideal */ }
                    <div className="bg-green-50 p-4 rounded-md border border-green-200 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h4 className="text-sm font-medium text-green-800 mb-1">ROAS Ideal (Meta)</h4>
                        <p className="text-2xl font-bold text-green-700">
                            { formatPercentage(idealROAS) }
                        </p>
                        <p className="text-xs text-green-600 mt-1">(Meta para lucro saudável)</p>
                    </div>

                    { /* Espaço reservado ou outra métrica se desejar */ }
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-center shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-center items-center">
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Taxa de Conversão (Referência)</h4>
                        <p className="text-2xl font-bold text-blue-700">
                1% - 3%
                        </p>
                        <p className="text-xs text-blue-600 mt-1">(Média de mercado para E-commerce)</p>
                    </div>

                </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
        Use estas metas como referência para analisar suas campanhas de anúncios.
            </p>
        </div>
    );
};

export default MetasCalculadora;