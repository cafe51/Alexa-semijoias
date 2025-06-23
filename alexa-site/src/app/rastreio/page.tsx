// pages/rastreio.tsx
'use client';
import { useState } from 'react';

type Evento = {
  tipo: string
  descricao: string
  data: string
  local: string
}

export default function Rastreio() {
    const [codigo, setCodigo] = useState('');
    const [resultados, setResultados] = useState<Evento[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const consultarRastreamento = async() => {
        if (!codigo.trim()) {
            setError('Digite um código de rastreio válido.');
            return;
        }
        setLoading(true);
        setError('');
        setResultados([]);
        try {
            const res = await fetch(`/api/track?codigo=${encodeURIComponent(codigo.trim())}`);
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error || 'Erro desconhecido');
            }
            setResultados(json.eventos || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Rastreamento de Encomendas</h1>
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    placeholder="Código de rastreio (ex: PQ123456789BR)"
                    className="border p-2 rounded w-full"
                    value={ codigo }
                    onChange={ e => setCodigo(e.target.value) }
                />
                <button
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={ consultarRastreamento }
                >
          Consultar
                </button>
            </div>
            { loading && <p>Carregando...</p> }
            { error && <p className="text-red-600">{ error }</p> }
            { resultados.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Eventos de Rastreamento:</h2>
                    { resultados.map((ev, idx) => (
                        <div key={ idx } className="border border-gray-200 rounded p-3 mb-2">
                            <div className="text-sm text-gray-600">{ ev.data }</div>
                            <div className="font-medium">{ ev.descricao }</div>
                            <div className="text-sm text-gray-500">{ ev.local }</div>
                        </div>
                    )) }
                </div>
            ) }
        </div>
    );
}
