// app/checkout/AccountSection.tsx

export default function AccountSection({ email, cpf, telefone }: {email: string, cpf: string, telefone: string}) {
    return (
        <section className='flex flex-col w-full bg-green-50 border-green-200 p-2 border-2 rounded-lg px-6'>
            <div className='flex justify-between w-full'>

                <p className="font-bold">CONTA</p>
                <p
                    className='text-blue-400 text-sm w-full text-end'
                >
              Trocar de conta
                </p>
            </div>

            <div className='flex flex-col p-2'>
                <p>{ email }</p>
                <p>{ cpf }</p>
                <p>{ telefone }</p>
            </div>
        </section>
    );
}