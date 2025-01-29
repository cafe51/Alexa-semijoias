export default function deepEqual(obj1: { [key: string]: string } | string, obj2: { [key: string]: string } | string) {
    // Se os dois objetos são exatamente iguais
    if (obj1 === obj2) return true;
  
    // Se um dos dois não for um objeto ou for null
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;
  
    // Comparar as chaves dos dois objetos
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    // Se o número de chaves for diferente, os objetos não são iguais
    if (keys1.length !== keys2.length) return false;
  
    // Comparar cada propriedade de forma recursiva
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
  
    return true;
}