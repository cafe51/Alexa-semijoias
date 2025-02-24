export default function adjustPriceTo99(price: number): number {
    let integerPart = Math.floor(price);
    
    // Se a parte inteira termina com 0, diminui 1
    if (integerPart % 10 === 0) {
        integerPart -= 1;
    }
    
    return integerPart + 0.99;
}