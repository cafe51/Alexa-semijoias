export const getRandomBarCode = (totalProductVariationsCreated: number) => {
    const randomNumber = (Math.floor(Math.random() * 9000) + 1000).toString();
    return ('78902166' + randomNumber + totalProductVariationsCreated);
};