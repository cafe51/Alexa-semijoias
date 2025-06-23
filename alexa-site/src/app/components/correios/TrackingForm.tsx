// src/app/components/correios/TrackingForm.tsx
import { useState } from 'react';

interface Evento {
  dtHrCriado: string;
  descricao: string;
  unidade?: { endereco?: { uf: string; cidade: string } };
}

interface RastroData {
  objetos?: Array<{ codObjeto: string; eventos: Evento[] }>;
}

export default function TrackingForm() {
    const [codigo, setCodigo] = useState('');
    const [result, setResult] = useState<RastroData | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!codigo) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/track?code=${codigo}`);
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error('Erro no fetch:', err);
            setResult(null);
        }
        setLoading(false);
    }

    const eventos = result?.objetos?.[0]?.eventos || [];
    return (
        <div className="max-w-md mx-auto p-4">
            <form onSubmit={ handleSubmit } className="mb-4">
                <label className="block mb-2 font-bold">Código de rastreamento</label>
                <input
                    type="text"
                    value={ codigo }
                    onChange={ e => setCodigo(e.target.value.toUpperCase()) }
                    placeholder="PQ123456789BR"
                    className="w-full px-3 py-2 border rounded mb-2"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={ loading }
                >
                    { loading ? 'Consultando...' : 'Consultar' }
                </button>
            </form>
            { result && (
                <div>
                    { eventos.length > 0 ? (
                        eventos.map((evt, idx) => (
                            <div key={ idx } className="p-2 border border-gray-200 rounded mb-2">
                                <div className="font-semibold">{ evt.descricao }</div>
                                <div className="text-sm text-gray-600">{ evt.dtHrCriado }</div>
                                { evt.unidade?.endereco && (
                                    <div className="text-sm text-gray-600">
                                        { evt.unidade.endereco.uf } - { evt.unidade.endereco.cidade }
                                    </div>
                                ) }
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">Nenhum evento encontrado para este código.</p>
                    ) }
                </div>
            ) }
        </div>
    );
}
