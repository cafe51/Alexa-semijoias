//app/utils/fetchAddressFromCEP.tsx

import axios from 'axios';
import { ViaCepResponse } from './types';

const fetchAddressFromCEP = async(cep: string):Promise<(ViaCepResponse)> => {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching address:', error);
        throw new Error('Failed to fetch address');
    }
};

export default fetchAddressFromCEP;
