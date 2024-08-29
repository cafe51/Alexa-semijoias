function removerAcentos(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const getRandomSku = (sections: string[], barCode: string, customProperties?: { [key: string]: string; }) => {
    const sectionsClone = [...sections];
    const sectionNamesForSku = sectionsClone.map((section) => section.slice(0,3)).join('');
    let skuString = sectionNamesForSku;
    if(customProperties) {
        for (const property in customProperties) {
            skuString += property.slice(0, 3) + customProperties[property].slice(0, 3);
        }
    }
    // [{cor: amarelo, tamanho: 14}, {cor: amarelo, tamanho: 16}, {cor: verde, tamanho: 14}]
    // [coramtam14, coramtam16, corvertam14]
    return removerAcentos(skuString + barCode.split('78902166')[1]);
};