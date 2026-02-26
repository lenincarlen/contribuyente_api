import { Link } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';

interface Contribuyente {
    rncCedula: string;
    nombre: string;
    tipo: string;
    estatus: string;
}

interface ContribuyenteCardProps {
    contribuyente: Contribuyente;
}

const BuildingIcon = () => <FileText size={20} strokeWidth={2} />;

export const ContribuyenteCard = ({ contribuyente }: ContribuyenteCardProps) => {
    return (
        <Link
            to={`/contribuyentes/${contribuyente.rncCedula}`}
            className="group block bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-smooth hover:shadow-md hover:border-green-200 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth rounded-bl-full pointer-events-none" />

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

                <span className="text-sm font-medium text-gray-400 group-hover:text-green-500 transition-smooth flex items-center gap-1">
                    Ver detalle
                    <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-smooth" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </Link>
    );
};
