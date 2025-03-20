export function shortenText(text: string, maxLength: number = 100): string {

    // Se o texto já for menor ou igual a 100 caracteres, retorna-o sem alterações.
    if (text.length <= maxLength) {
        return text;
    }

    // Procura todos os índices onde há um ponto final.
    const periodIndexes: number[] = [];
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '.') {
            periodIndexes.push(i);
        }
    }

    // Caso não haja ponto final ou o primeiro ponto esteja além do limite,
    // retorna os primeiros 100 caracteres (mesmo que interrompa uma frase).
    if (periodIndexes.length === 0 || periodIndexes[0] >= maxLength) {
        return text.substring(0, maxLength);
    }

    // Itera pelos índices dos pontos finais para verificar até qual deles podemos incluir a sentença completa
    // sem ultrapassar o limite de 100 caracteres.
    let candidate = '';
    for (const index of periodIndexes) {
    // index + 1 para incluir o próprio ponto final
        if (index + 1 <= maxLength) {
            candidate = text.substring(0, index + 1);
        } else {
            break;
        }
    }

    // Se, por algum motivo, nenhum candidato for definido (o que não deve acontecer),
    // retorna os primeiros 100 caracteres.
    if (candidate === '') {
        candidate = text.substring(0, maxLength);
    }

    return candidate;
}
