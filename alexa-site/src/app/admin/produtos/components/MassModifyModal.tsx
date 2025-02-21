// src/app/admin/produtos/components/MassModifyModal.tsx
'use client';
import React, { useState } from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';

interface MassModifyModalProps {
  onClose: () => void;
  onConfirm: (options: {
      showProduct: boolean | null;
      lancamento: boolean | null;
      removePromotion: boolean;
      priceModification: {
         value: number | null;
         type: 'percentual' | 'fixo' | null;
         operation: 'increase' | 'decrease' | null;
      }
  }) => void;
}

export default function MassModifyModal({ onClose, onConfirm }: MassModifyModalProps) {
    // Estado para visibilidade (showProduct): true (Mostrar), false (Ocultar) ou null (Não alterar)
    const [showProduct, setShowProduct] = useState<boolean | null>(null);
    // Estado para lançamento: true (Sim), false (Não) ou null (Não alterar)
    const [lancamento, setLancamento] = useState<boolean | null>(null);
    // Estado para remoção da promoção (valor true indica que o produto terá o preço promocional zerado)
    const [removePromotion, setRemovePromotion] = useState(false);

    // Estados para modificação de preço:
    // Valor numérico para a alteração
    const [priceValue, setPriceValue] = useState<number | null>(null);
    // Tipo de alteração: 'fixo' ou 'percentual'
    const [priceType, setPriceType] = useState<'percentual' | 'fixo' | null>('fixo');
    // Operação: 'increase' para aumento ou 'decrease' para desconto
    const [priceOperation, setPriceOperation] = useState<'increase' | 'decrease' | null>('increase');

    const handleSubmit = () => {
        onConfirm({ 
            showProduct, 
            lancamento, 
            removePromotion, 
            priceModification: (priceValue !== null && priceType && priceOperation)
                ? { value: priceValue, type: priceType, operation: priceOperation }
                : { value: null, type: null, operation: null },
        });
    };

    return (
        <ModalMaker closeModelClick={ onClose } title="Opções Avançadas">
            <div className="p-2 flex flex-col gap-8 w-full">
                { /* Visibilidade na Loja */ }
                <div>
                    <label className="block font-medium mb-2 text-gray-700">Visibilidade</label>
                    <select
                        value={ showProduct === null ? 'null' : showProduct ? 'true' : 'false' }
                        onChange={ (e) => {
                            const val = e.target.value;
                            if(val === 'true') setShowProduct(true);
                            else if(val === 'false') setShowProduct(false);
                            else setShowProduct(null);
                        } }
                        className="w-full p-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    >
                        <option value="null">Não alterar</option>
                        <option value="true">Mostrar</option>
                        <option value="false">Ocultar</option>
                    </select>
                </div>
                { /* Lançamento */ }
                <div>
                    <label className="block font-medium mb-2 text-gray-700">Lançamento:</label>
                    <select
                        value={ lancamento === null ? 'null' : lancamento ? 'true' : 'false' }
                        onChange={ (e) => {
                            const val = e.target.value;
                            if(val === 'true') setLancamento(true);
                            else if(val === 'false') setLancamento(false);
                            else setLancamento(null);
                        } }
                        className="w-full p-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    >
                        <option value="null">Não alterar</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </select>
                </div>
                { /* Promoção */ }
                <div>
                    <label className="block font-medium mb-2 text-gray-700">Promoção:</label>
                    <select
                        value={ removePromotion ? 'true' : 'false' }
                        onChange={ (e) => setRemovePromotion(e.target.value === 'true') }
                        className="w-full p-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    >
                        <option value="false">Não alterar</option>
                        <option value="true">Remover</option>
                    </select>
                </div>
                { /* Modificação de Preço */ }
                <div>
                    <label className="block font-medium mb-2 text-gray-700">Preço:</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Valor para modificação"
                            value={ priceValue !== null ? priceValue : '' }
                            onChange={ (e) => setPriceValue(e.target.value ? parseFloat(e.target.value) : null) }
                            className="w-full p-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        />
                        <select
                            value={ priceType ? priceType : '' }
                            onChange={ (e) => {
                                const val = e.target.value;
                                setPriceType(val === 'fixo' || val === 'percentual' ? val : null);
                            } }
                            className="w-full p-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        >
                            <option value="fixo">Fixo</option>
                            <option value="percentual">Percentual</option>
                        </select>
                        <select
                            value={ priceOperation ? priceOperation : '' }
                            onChange={ (e) => {
                                const val = e.target.value;
                                setPriceOperation(val === 'increase' || val === 'decrease' ? val : null);
                            } }
                            className="w-full p-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        >
                            <option value="increase">Aumentar</option>
                            <option value="decrease">Diminuir</option>
                        </select>
                    </div>
                </div>
                { /* Botões de Ação */ }
                <div className="mt-8 flex justify-between ">
                    <button  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors" onClick={ onClose }>
            Cancelar
                    </button>
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors" onClick={ handleSubmit }>
            Aplicar
                    </button>
                </div>
            </div>
        </ModalMaker>
    );
}
