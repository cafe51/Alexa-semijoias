import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useLogout } from '../hooks/useLogout';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { FireBaseDocument, UserType } from '../utils/types';

interface DeleteAccountDialogProps {
    userInfo: (UserType & FireBaseDocument)
}

export default function DeleteAccountDialog({ userInfo }: DeleteAccountDialogProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useLogout();
    const { deleteUserAccount } = useDeleteUser();
    const router = useRouter();

    const handleSubmitDeleteMySelf = async(e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await deleteUserAccount(userInfo.email, password);
            logout();
            router.push('/');
        } catch (err) {
            setError('Falha ao excluir a conta. Verifique sua senha e tente novamente.');
            setPassword('');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <Dialog>
            <DialogTrigger asChild className=''>
                <Button variant="destructive" className="w-full md:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Minha Conta
                </Button>
            </DialogTrigger>
            <DialogContent className="">
                <form onSubmit={ handleSubmitDeleteMySelf }>
                    <DialogHeader>
                        <DialogTitle className='md:text-4xl'>Excluir Conta</DialogTitle>
                        <DialogDescription className='md:text-xl'>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 md:gap-8">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                            <p className="text-sm font-semibold text-red-500 md:text-xl">Atenção: Esta ação é irreversível!</p>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right md:text-xl">
                                Senha
                            </Label>
                            <Input 
                                className="col-span-3 md:text-lg md:p-6" 
                                id="password" 
                                type="password" 
                                placeholder="Digite sua senha para confirmar"
                                value={ password }
                                onChange={ (e) => setPassword(e.target.value) }
                                required
                            />
                        </div>
                        { error && <p className="text-red-500 text-sm">{ error }</p> }
                    </div>
                    <DialogFooter>
                        <Button 
                            type="submit" 
                            variant="destructive" 
                            className="md:text-xl"
                            disabled={ isLoading }
                        >
                            { isLoading ? 'Excluindo...' : 'Confirmar Exclusão' }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}