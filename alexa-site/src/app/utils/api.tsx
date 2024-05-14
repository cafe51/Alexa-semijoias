import axios from 'axios';

const url = 'http://localhost:3000/';

const axiosInstance = axios.create({
    baseURL: url,
});

export const getProductApi = async(product: string) => {
    try {
        const { data } = await axiosInstance.get(`/${product}`);

        return data;
    } catch(error) {
        return error;
    }
};

export const getProductApiById = async(product: string, id: string) => {
    try {
        const { data } = await axiosInstance.get(`/${product}/${id}`);

        return data;
    } catch(error) {
        return error;
    } 
};