import { Timestamp } from 'firebase/firestore';

export const emptyUserTypeInitialState = {
    exist: false,
    id: '',
    nome: '',
    email: '',
    userId: '',
    cpf: '',
    phone: '',
    admin: false,
    address: {
        bairro: '',
        cep: '',
        complemento: '',
        ddd: '',
        gia: '',
        ibge: '',
        localidade: '',
        logradouro: '',
        numero: '',
        siafi: '',
        uf: '',
        unidade: '',
        referencia: '',

        estado: '',
        regiao: '',
    },
    createdAt: Timestamp.now(),

};