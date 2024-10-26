import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { FireBaseDocument, UserType } from '../utils/types';

interface CustomerInfoProps {
    userInfo: (UserType & FireBaseDocument)
    onEdit: () => void;
}

export default function CustomerInfo({ userInfo, onEdit }: CustomerInfoProps) {
    return (
        <Card className="mb-8 border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333] px-4">
                <div className="flex justify-between items-start ">
                    <CardTitle className="text-2xl font-semibold">Dados Pessoais</CardTitle>
                    <Button variant="ghost" size="sm" onClick={ onEdit } className="text-[#333333] hover:bg-[#C48B9F] hover:text-white md:text-lg">
                        <Edit className="mr-2 h-4 w-4 md:h-5 md:w-5 " />
                        Editar
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div >
                        <p className="font-semibold mb-1">Nome:</p>
                        <p>{ userInfo.nome }</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">E-mail:</p>
                        <p>{ userInfo.email }</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">Telefone:</p>
                        <p>{ userInfo.phone }</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-1">CPF:</p>
                        <p>{ userInfo.cpf ? userInfo.cpf : '--' }</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
