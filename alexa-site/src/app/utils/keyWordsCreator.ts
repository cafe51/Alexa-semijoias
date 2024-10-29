function generatePrefixes(word: string): string[] {
    const prefixes: string[] = [];
    for (let i = 1; i <= word.length; i++) {
        prefixes.push(word.slice(0, i));
    }
    return prefixes;
}

export default function keyWordsCreator(name: string): string[] {
    const words = name.split(' ');
    const combinations: string[] = [];

    for (let i = 0; i < words.length; i++) {
        let currentCombination = '';
        for (let j = i; j < words.length; j++) {
            currentCombination = currentCombination ? `${currentCombination} ${words[j]}` : words[j];
            combinations.push(currentCombination);

            // Adiciona todos os prefixos da combinação atual
            const prefixCombinations = generatePrefixes(currentCombination);
            combinations.push(...prefixCombinations);
        }
    }

    // Remove duplicados para otimizar espaço
    return Array.from(new Set(combinations));
}