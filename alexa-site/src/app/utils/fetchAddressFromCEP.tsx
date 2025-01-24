//app/utils/fetchAddressFromCEP.tsx

import axios from 'axios';
import { ViaCepResponse } from './types';

const fetchAddressFromCEP = async(cep: string): Promise<ViaCepResponse> => {
    try {
        const cleanCep = cep.replace(/\D/g, '');
        
        if (cleanCep.length !== 8) {
            throw new Error('CEP inválido');
        }

        const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        
        if (response.data.erro) {
            throw new Error('CEP não encontrado');
        }
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro na requisição do CEP:', error.message);
            throw new Error('Erro ao buscar o CEP. Por favor, tente novamente.');
        }
        
        console.error('Erro ao buscar endereço:', error);
        throw error;
    }
};

export default fetchAddressFromCEP;
