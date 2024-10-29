export default function toTitleCase(str: string) {
    return str
        .toLowerCase() // Primeiro, transforma tudo em minúsculo
        .split(' ')    // Divide a string em um array de palavras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
        .join(' ');    // Junta tudo de volta em uma única string
}

// Exemplo de uso:
// const frase = 'javascript É incrível!';
// console.log(toTitleCase(frase)); // Output: "Javascript É Incrível!"
