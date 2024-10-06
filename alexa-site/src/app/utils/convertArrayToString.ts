export function convertArrayToString(array: any[]): string {
    return array.reduce((acc, item) => {
        return acc + ` ${item}`; // Ajustar o formato conforme necessário
    }, '');
}
