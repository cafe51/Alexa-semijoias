import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

const PolicySection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Card className="mb-6 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#333333]">{ title }</h2>
            { children }
        </CardContent>
    </Card>
);

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333]" style={ { fontFamily: 'Montserrat, sans-serif' } }>
            <header className="bg-[#D4AF37] text-white py-12 px-4 text-center">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
                <p className="text-lg sm:text-xl max-w-2xl mx-auto">
          Sua privacidade é importante para nós. Conheça nossas práticas e compromissos.
                </p>
            </header>

            <main className="max-w-4xl mx-auto py-12 px-4">
                <PolicySection title="Introdução">
                    <p className="mb-4">
            A sua privacidade é importante para nós. É política da ALEXA SEMIJOIAS respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site <a href="https://alexasemijoias.com.br" className="text-[#C48B9F] hover:text-[#D4AF37] transition-colors duration-300">ALEXA SEMIJOIAS</a>, e outros sites que possuímos e operamos.
                    </p>
                    <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
                    </p>
                </PolicySection>

                <PolicySection title="Coleta e Uso de Informações">
                    <p className="mb-4">
            Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
                    </p>
                    <p>
            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
                    </p>
                </PolicySection>

                <PolicySection title="Links Externos">
                    <p>
            O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
                    </p>
                </PolicySection>

                <PolicySection title="Seu Consentimento">
                    <p className="mb-4">
            Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
                    </p>
                    <p>
            O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
                    </p>
                </PolicySection>

                <PolicySection title="Mais informações">
                    <p className="mb-4">
            Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.
                    </p>
                    <p>
            Esta política é efetiva a partir de 31 de outubro 2024 14:26
                    </p>
                </PolicySection>
            </main>

        </div>
    );
};

export default PrivacyPolicyPage;