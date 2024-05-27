export default function Footer() {
    return (
        <footer className='self-end place-self-end justify-self-end w-full primColor flex justify-center items-center p-4 pt-10' >
            <div className="flex flex-col justify-center w-full items-start gap-4 ">
                <div className="flex w-full  space-between gap-6">
                    <div className="flex flex-col gap-4">
                        <p className='text-xl font-bold'>Categorias</p>
                        <span>Início</span>
                        <span>Todos os produtos</span>
                        <span>Anéis</span>
                        <span>Brincos</span>
                        <span>Colares</span>
                        <span>Pulseiras</span>
                    </div>
                    <div className="flex flex-col w-1/2 gap-4">
                        <p className='text-xl font-bold'>Informações</p>
                        <span>Sobre nós</span>
                        <span>Atacado</span>
                        <span>Discas e Cuidados</span>
                        <span>Material das peças</span>
                        <span>Como saber o tamanho ideal do meu anel?</span>
                        <span>Perguntas frequentes</span>
                        <span>Política de Privacidade</span>
                        <span>Fale conosco</span>

                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <p className='text-xl font-bold'>Entre em contato</p>
                    <span>551145084511</span>
                    <span>lavandula.bijoux@yahoo.com</span>
                </div>
            </div>
        </footer>
    );
}