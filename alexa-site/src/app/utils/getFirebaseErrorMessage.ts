type FirebaseAuthError =
  | 'admin-restricted-operation'
  | 'argument-error'
  | 'app-not-authorized'
  | 'app-not-installed'
  | 'captcha-check-failed'
  | 'code-expired'
  | 'cordova-not-ready'
  | 'cors-unsupported'
  | 'credential-already-in-use'
  | 'custom-token-mismatch'
  | 'requires-recent-login'
  | 'dynamic-link-not-activated'
  | 'email-change-needs-verification'
  | 'email-already-in-use'
  | 'expired-action-code'
  | 'cancelled-popup-request'
  | 'internal-error'
  | 'invalid-app-credential'
  | 'invalid-app-id'
  | 'invalid-user-token'
  | 'invalid-auth-event'
  | 'invalid-verification-code'
  | 'invalid-continue-uri'
  | 'invalid-cordova-configuration'
  | 'invalid-custom-token'
  | 'invalid-dynamic-link-domain'
  | 'invalid-email'
  | 'invalid-api-key'
  | 'invalid-cert-hash'
  | 'invalid-credential'
  | 'invalid-message-payload'
  | 'invalid-multi-factor-session'
  | 'invalid-oauth-provider'
  | 'invalid-oauth-client-id'
  | 'unauthorized-domain'
  | 'invalid-action-code'
  | 'wrong-password'
  | 'invalid-persistence-type'
  | 'invalid-phone-number'
  | 'invalid-provider-id'
  | 'invalid-recipient-email'
  | 'invalid-sender'
  | 'invalid-verification-id'
  | 'invalid-tenant-id'
  | 'multi-factor-info-not-found'
  | 'multi-factor-auth-required'
  | 'missing-android-pkg-name'
  | 'auth-domain-config-required'
  | 'missing-app-credential'
  | 'missing-verification-code'
  | 'missing-continue-uri'
  | 'missing-iframe-start'
  | 'missing-ios-bundle-id'
  | 'missing-multi-factor-info'
  | 'missing-multi-factor-session'
  | 'missing-or-invalid-nonce'
  | 'missing-phone-number'
  | 'missing-verification-id'
  | 'app-deleted'
  | 'account-exists-with-different-credential'
  | 'network-request-failed'
  | 'no-auth-event'
  | 'no-such-provider'
  | 'null-user'
  | 'operation-not-allowed'
  | 'operation-not-supported-in-this-environment'
  | 'popup-blocked'
  | 'popup-closed-by-user'
  | 'provider-already-linked'
  | 'quota-exceeded'
  | 'redirect-cancelled-by-user'
  | 'redirect-operation-pending'
  | 'rejected-credential'
  | 'second-factor-already-in-use'
  | 'maximum-second-factor-count-exceeded'
  | 'tenant-id-mismatch'
  | 'timeout'
  | 'user-token-expired'
  | 'too-many-requests'
  | 'unauthorized-continue-uri'
  | 'unsupported-first-factor'
  | 'unsupported-persistence-type'
  | 'unsupported-tenant-operation'
  | 'unverified-email'
  | 'user-cancelled'
  | 'user-not-found'
  | 'user-disabled'
  | 'user-mismatch'
  | 'user-signed-out'
  | 'weak-password'
  | 'web-storage-unsupported';

const authErrorMessages: Record<FirebaseAuthError, string> = {
    'admin-restricted-operation': 'Esta operação é restrita apenas para administradores.',
    'argument-error': 'Erro nos argumentos fornecidos.',
    'app-not-authorized': 'Este aplicativo não está autorizado a usar o Firebase Authentication com a chave de API fornecida.',
    'app-not-installed': 'O aplicativo solicitado não está instalado neste dispositivo.',
    'captcha-check-failed': 'Falha na verificação do reCAPTCHA. Tente novamente.',
    'code-expired': 'O código de verificação expirou. Reenvie o código para tentar novamente.',
    'cordova-not-ready': 'O framework Cordova não está pronto.',
    'cors-unsupported': 'Este navegador não é suportado.',
    'credential-already-in-use': 'Estas credenciais já estão em uso por outra conta.',
    'custom-token-mismatch': 'O token personalizado corresponde a um público diferente.',
    'requires-recent-login': 'Por segurança, faça login novamente para continuar.',
    'dynamic-link-not-activated': 'Ative os Links Dinâmicos no Console do Firebase.',
    'email-change-needs-verification': 'Usuários multifatoriais precisam de um e-mail verificado.',
    'email-already-in-use': 'O e-mail informado já está em uso por outra conta.',
    'expired-action-code': 'O código de ação expirou.',
    'cancelled-popup-request': 'Esta operação foi cancelada devido a outra janela em aberto.',
    'internal-error': 'Ocorreu um erro interno.',
    'invalid-app-credential': 'Credenciais de aplicativo inválidas.',
    'invalid-app-id': 'O identificador do aplicativo não está registrado para este projeto.',
    'invalid-user-token': 'As credenciais deste usuário são inválidas para este projeto.',
    'invalid-auth-event': 'Ocorreu um erro interno.',
    'invalid-verification-code': 'O código de verificação é inválido. Reenvie o código e tente novamente.',
    'invalid-continue-uri': 'A URL fornecida na solicitação é inválida.',
    'invalid-cordova-configuration': 'Plugins Cordova necessários estão ausentes.',
    'invalid-custom-token': 'O formato do token personalizado está incorreto.',
    'invalid-dynamic-link-domain': 'O domínio de link dinâmico fornecido não está configurado para este projeto.',
    'invalid-email': 'O endereço de e-mail está mal formatado.',
    'invalid-api-key': 'Chave de API inválida.',
    'invalid-cert-hash': 'O hash do certificado SHA-1 fornecido é inválido.',
    'invalid-credential': 'As credenciais de autenticação fornecidas estão inválidas ou expiraram.',
    'invalid-message-payload': 'O template de e-mail contém caracteres inválidos.',
    'invalid-multi-factor-session': 'Prova de autenticação multifatorial ausente ou inválida.',
    'invalid-oauth-provider': 'Este provedor OAuth não é suportado.',
    'invalid-oauth-client-id': 'ID de cliente OAuth inválido.',
    'unauthorized-domain': 'Domínio não autorizado para operações OAuth no seu projeto Firebase.',
    'invalid-action-code': 'O código de ação é inválido ou expirou.',
    'wrong-password': 'A senha é inválida ou o usuário não possui senha.',
    'invalid-persistence-type': 'Tipo de persistência inválido.',
    'invalid-phone-number': 'O número de telefone está em um formato incorreto.',
    'invalid-provider-id': 'ID de provedor inválido.',
    'invalid-recipient-email': 'O endereço de e-mail do destinatário é inválido.',
    'invalid-sender': 'O e-mail de remetente é inválido.',
    'invalid-verification-id': 'ID de verificação inválido.',
    'invalid-tenant-id': 'ID de inquilino inválido.',
    'multi-factor-info-not-found': 'Nenhum segundo fator corresponde ao identificador fornecido.',
    'multi-factor-auth-required': 'Prova de posse de segundo fator necessária para o login.',
    'missing-android-pkg-name': 'O nome do pacote Android é obrigatório.',
    'auth-domain-config-required': 'Inclua authDomain ao chamar firebase.initializeApp().',
    'missing-app-credential': 'Faltam credenciais do aplicativo para a verificação de telefone.',
    'missing-verification-code': 'O código de verificação de SMS está ausente.',
    'missing-continue-uri': 'A URL de continuação é obrigatória.',
    'missing-iframe-start': 'Ocorreu um erro interno.',
    'missing-ios-bundle-id': 'O iOS Bundle ID é obrigatório.',
    'missing-multi-factor-info': 'Identificador de segundo fator ausente.',
    'missing-multi-factor-session': 'Faltam provas de autenticação do primeiro fator.',
    'missing-or-invalid-nonce': 'Nonce inválido na solicitação.',
    'missing-phone-number': 'O número de telefone é obrigatório para enviar o código de verificação.',
    'missing-verification-id': 'ID de verificação ausente.',
    'app-deleted': 'Esta instância do FirebaseApp foi excluída.',
    'account-exists-with-different-credential': 'Uma conta com este e-mail já existe, mas com credenciais diferentes.',
    'network-request-failed': 'Erro de rede (tempo limite ou conexão interrompida).',
    'no-auth-event': 'Ocorreu um erro interno.',
    'no-such-provider': 'O usuário não está vinculado a este provedor.',
    'null-user': 'Usuário nulo fornecido para a operação.',
    'operation-not-allowed': 'O provedor de login está desativado.',
    'operation-not-supported-in-this-environment': 'Operação não suportada neste ambiente.',
    'popup-blocked': 'Não foi possível abrir a janela. Pode ter sido bloqueada pelo navegador.',
    'popup-closed-by-user': 'A janela foi fechada pelo usuário.',
    'provider-already-linked': 'O usuário já está vinculado a este provedor.',
    'quota-exceeded': 'A cota do projeto foi excedida.',
    'redirect-cancelled-by-user': 'O redirecionamento foi cancelado pelo usuário.',
    'redirect-operation-pending': 'Operação de redirecionamento pendente.',
    'rejected-credential': 'Credenciais recusadas.',
    'second-factor-already-in-use': 'O segundo fator já está registrado nesta conta.',
    'maximum-second-factor-count-exceeded': 'Número máximo de fatores excedido.',
    'tenant-id-mismatch': 'O ID do inquilino fornecido não corresponde.',
    timeout: 'A operação excedeu o tempo limite.',
    'user-token-expired': 'As credenciais do usuário expiraram. Faça login novamente.',
    'too-many-requests': 'Detectamos atividade incomum. Tente novamente mais tarde.',
    'unauthorized-continue-uri': 'O domínio da URL de continuação não está na lista de permissões.',
    'unsupported-first-factor': 'Primeiro fator não suportado.',
    'unsupported-persistence-type': 'O ambiente atual não suporta o tipo de persistência especificado.',
    'unsupported-tenant-operation': 'Operação não suportada em contexto multi-inquilino.',
    'unverified-email': 'A operação requer e-mail verificado.',
    'user-cancelled': 'Permissões solicitadas não foram concedidas pelo usuário.',
    'user-not-found': 'Usuário não encontrado.',
    'user-disabled': 'Conta desativada pelo administrador.',
    'user-mismatch': 'Credenciais não correspondem ao usuário atual.',
    'user-signed-out': 'Usuário desconectado.',
    'weak-password': 'A senha deve ter no mínimo 6 caracteres.',
    'web-storage-unsupported': 'Navegador não suportado ou cookies/desativados.',
};

export function getFirebaseErrorMessage(fullErrorMessage: string): string {
    // Verifica se a mensagem começa com "Firebase: Error"
    if (!fullErrorMessage.startsWith('Firebase: Error')) {
        return 'Ocorreu um erro desconhecido.';
    }
  
    // Localiza o índice de abertura e fechamento dos parênteses
    const start = fullErrorMessage.indexOf('(');
    const end = fullErrorMessage.indexOf(')');
  
    // Extrai o código de erro entre parênteses
    let errorCode = fullErrorMessage.slice(start + 1, end);
  
    // Remove o prefixo "auth/" se presente
    if (errorCode.startsWith('auth/')) {
        errorCode = errorCode.slice(5);
    }
  
    // Busca a mensagem de erro em português
    return authErrorMessages[errorCode as FirebaseAuthError] || 'Ocorreu um erro desconhecido.';
}
