export default function validarCPF(cpf: string): boolean {
    // 1. Limpeza do CPF
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    // 2. Validação básica
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF inválido se não tiver 11 dígitos ou se todos forem iguais
    }

    // 3. Cálculo dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let primeiroDigito = 11 - (soma % 11);
    if (primeiroDigito > 9) {
        primeiroDigito = 0;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let segundoDigito = 11 - (soma % 11);
    if (segundoDigito > 9) {
        segundoDigito = 0;
    }

    // 4. Verificação dos dígitos
    if (
        parseInt(cpf.charAt(9)) !== primeiroDigito ||
    parseInt(cpf.charAt(10)) !== segundoDigito
    ) {
        return false; // CPF inválido se os dígitos não corresponderem
    }

    return true; // CPF válido
}