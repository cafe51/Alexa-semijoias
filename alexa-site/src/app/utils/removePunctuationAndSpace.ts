export function removePunctuation(str: string) {
    const allowedChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ~`´^çàáâãéèêíìîóòôõúùû';
    let result = '';
    for (let i = 0; i < str.length; i++) {
        if (allowedChars.indexOf(str[i]) !== -1) {
            result += str[i];
        }
    }
    return result;
}
  

export function removePunctuationAndSpace(str: string): string {
    const textoSemPontuacao = removePunctuation(str);
    return textoSemPontuacao.replace(/\s+/g, ' '); // Substitui múltiplos espaços por um único espaço
}