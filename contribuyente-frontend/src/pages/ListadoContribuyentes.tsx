import useSWR from 'swr';
import { Activity } from 'lucide-react';
import { api } from '../services/api';
import { ContribuyenteCard } from '../components/ContribuyenteCard';

// Tipos reflejando el DTO de C#
export type Contribuyente = {
    rncCedula: string;
    nombre: string;
    tipo: string;
    estatus: string;
};

const fetcher = (url: string) => api.get<Contribuyente[]>(url).then((res) => res.data);

export default function ListadoContribuyentes() {
    const { data, error, isLoading } = useSWR('/contribuyentes', fetcher);

    return (
        <div className="w-full animation-fade-in">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Directorio</h2>
                    <p className="text-gray-500 mt-1">Listado oficial de contribuyentes registrados.</p>
                </div>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium border border-gray-100 shadow-sm flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    <span>{isLoading ? '...' : data ? data.length : 0} Registros</span>
                </div>
            </div>

            {error ? (
                <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-100 flex flex-col items-center justify-center text-center">
                    <p className="font-semibold mb-2">Error de conexión</p>
                    <p className="text-sm opacity-90">No se pudo obtener el listado de contribuyentes. Valide que el backend responda en el puerto 5097.</p>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-40 bg-gray-100 rounded-2xl border border-gray-200"></div>
                    ))}
                </div>
            ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((contribuyente) => (
                        <ContribuyenteCard key={contribuyente.rncCedula} contribuyente={contribuyente} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

