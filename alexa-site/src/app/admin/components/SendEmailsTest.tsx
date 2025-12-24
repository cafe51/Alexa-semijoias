import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { sendEmailConfirmation, sendEmailApprovedPayment, sendEmailOrderSent, sendEmailOrderCanceled } from '@/app/utils/apiCall';
import { OrderType, UserType } from '@/app/utils/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const emailList = [
    'test-zbh7qw524@srv1.mail-tester.com',
    'alexasemijoias@alexasemijoias.com.br',
    'cafecafe51@hotmail.com',
    'japhe.nog@gmail.com',
    'alexa.artes@yahoo.com.br',
];

const emailOptions = [
    { label: 'Confirmação de Pedido', value: 'orderConfirmation' },
    { label: 'Confirmação de Pagamento', value: 'paymentConfirmation' },
    { label: 'Confirmação de Envio', value: 'shippingConfirmation' },
    { label: 'Cancelamento de Pedido', value: 'cancelamento' },
];

export default function SendEmailsTest() {
    const [showModalConfirmation, setShowModalConfirmation] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [feedback, setFeedback] = useState<{ success: string[]; failure: string[] }>({
        success: [],
        failure: [],
    });
    const [emailType, setEmailType] = useState(emailOptions[0].value);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const { getAllDocuments: getOrders } = useCollection<OrderType>('pedidos');
    const { getDocumentById: getUserById } = useCollection<UserType>('usuarios');

    const toggleEmailSelection = (email: string) => {
        setSelectedEmails((prev) =>
            prev.includes(email)
                ? prev.filter((e) => e !== email)
                : [...prev, email],
        );
    };

    const handleSendEmails = async () => {
        if (selectedEmails.length === 0) {
            setFeedback({
                success: [],
                failure: ['Por favor, selecione ao menos um e-mail para envio.'],
            });
            return;
        }

        setIsSending(true);
        setFeedback({ success: [], failure: [] });

        try {
            const orders = await getOrders([{ field: 'paymentOption', operator: '==', value: 'pix' }], 1);
            if (orders.length === 0) {
                setFeedback({
                    success: [],
                    failure: ['Nenhum pedido encontrado.'],
                });
                return;
            }
            const userDate = await getUserById(orders[0].userId);

            const emailSuccessList: string[] = [];
            const emailErrorList: string[] = [];

            for (const email of selectedEmails) {
                userDate.email = email;

                let response = { status: 404 };
                switch (emailType) {
                    case 'cancelamento':
                        response = await sendEmailOrderCanceled(orders[0], userDate);
                        break;
                    case 'shippingConfirmation':
                        const orderWithTracking = {
                            ...orders[0],
                            tracknumber: 'AA123456789BR', // Generic tracking number for testing
                            deliveryOption: {
                                ...orders[0].deliveryOption,
                                name: 'PAC', // Ensuring it triggers the link logic
                            }
                        };
                        response = await sendEmailOrderSent(orderWithTracking, userDate);
                        break;
                    case 'paymentConfirmation':
                        response = await sendEmailApprovedPayment(orders[0], userDate);
                        break;
                    case 'orderConfirmation':
                        response = await sendEmailConfirmation(orders[0], userDate);
                        break;
                    default:
                        break;
                }

                if (response.status === 200) {
                    emailSuccessList.push(email);
                } else {
                    emailErrorList.push(email);
                }
            }

            setFeedback({
                success: emailSuccessList,
                failure: emailErrorList,
            });
        } catch (error) {
            console.error('Erro ao enviar e-mails:', error);
            setFeedback({
                success: [],
                failure: ['Erro ao enviar e-mails. Por favor, tente novamente.'],
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="mt-6 max-w-lg">
            <button
                onClick={() => setShowModalConfirmation(true)}
                disabled={isSending}
                className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSending ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isSending ? 'Enviando...' : 'Enviar e-mails'}
            </button>

            {showModalConfirmation && (
                <ModalMaker
                    title="Enviar E-mails"
                    closeModelClick={() => setShowModalConfirmation(false)}
                >
                    <div className="flex flex-col gap-6">
                        { /* Seleção de tipo de e-mail */}
                        <div>
                            <label
                                htmlFor="emailType"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Tipo de E-mail
                            </label>
                            <select
                                id="emailType"
                                value={emailType}
                                onChange={(e) => setEmailType(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                {emailOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        { /* Seleção de e-mails */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione os E-mails
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {emailList.map((email) => (
                                    <label key={email} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            value={email}
                                            checked={selectedEmails.includes(email)}
                                            onChange={() => toggleEmailSelection(email)}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span>{email}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        { /* Feedback após envio */}
                        {feedback.success.length > 0 && (
                            <div className="mt-4 bg-green-100 text-green-800 p-4 rounded-md">
                                <h3 className="font-bold">E-mails enviados com sucesso:</h3>
                                <ul className="list-disc pl-5">
                                    {feedback.success.map((email) => (
                                        <li key={email}>{email}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {feedback.failure.length > 0 && (
                            <div className="mt-4 bg-red-100 text-red-800 p-4 rounded-md">
                                <h3 className="font-bold">Erro ao enviar e-mails:</h3>
                                <ul className="list-disc pl-5">
                                    {feedback.failure.map((email) => (
                                        <li key={email}>{email}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        { /* Botões de ação */}
                        <div className="flex justify-between gap-2">
                            <Button onClick={handleSendEmails} disabled={isSending}>
                                {isSending ? 'Enviando...' : 'Enviar'}
                            </Button>
                            <Button onClick={() => setShowModalConfirmation(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </ModalMaker>
            )}
        </div>
    );
}
