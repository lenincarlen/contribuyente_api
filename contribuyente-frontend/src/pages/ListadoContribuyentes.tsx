import useSWR from 'swr';
import { Link } from 'react-router-dom';
import { Users, FileText, Activity } from 'lucide-react';
import { api } from '../services/api';

// Tipos reflejando el DTO de C#
type Contribuyente = {
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
                        <Link
                            key={contribuyente.rncCedula}
                            to={`/contribuyentes/${contribuyente.rncCedula}`}
                            className="group block bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-smooth hover:shadow-md hover:border-blue-200 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth rounded-bl-full pointer-events-none" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2.5 bg-gray-50 text-green-600 rounded-xl group-hover:bg-green-50 group-hover:text-green-600 transition-smooth">
                                    {contribuyente.tipo === 'PERSONA JURIDICA' ? <BuildingIcon /> : <Users size={20} strokeWidth={2} />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-smooth line-clamp-1">
                                        {contribuyente.nombre}
                                    </h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium font-mono mt-0.5">
                                        {contribuyente.rncCedula}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 border-dashed">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${contribuyente.estatus === 'ACTIVO' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                    }`}>
                                    {contribuyente.estatus}
                                </span>

                                <span className="text-sm font-medium text-gray-400 group-hover:text-blue-500 transition-smooth flex items-center gap-1">
                                    Ver detalle
                                    <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

const BuildingIcon = () => <FileText size={20} strokeWidth={2} />;
