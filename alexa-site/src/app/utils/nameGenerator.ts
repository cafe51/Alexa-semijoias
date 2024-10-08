export const nameGenerator = (nome: string) => {
    const fullName = nome;
    const words = fullName.split(' ');
    const firstName = words[0];
    // Juntamos o resto das palavras em uma única string (sobrenome completo)
    const lastName = words.slice(1).join(' ');
    return { firstName, lastName };
};