import useSWR from 'swr';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { TotalItbisHero } from '../components/TotalItbisHero';
import { ComprobantesTable } from '../components/ComprobantesTable';

type Comprobante = {
    ncf: string;
    monto: number;
    itbis18: number;
};

type Detalle = {
    rncCedula: string;
    comprobantes: Comprobante[];
    totalItbis: number;
};

const fetcher = (url: string) => api.get<Detalle>(url).then((res) => res.data);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value);
};

export default function DetalleContribuyente() {
    const { rnc } = useParams<{ rnc: string }>();
    const { data, error, isLoading } = useSWR(rnc ? `/contribuyentes/${rnc}/detalles` : null, fetcher);

    return (
        <div className="w-full max-w-4xl mx-auto animation-fade-in-up">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-smooth mb-6 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-smooth" />
                    Volver al listado
                </Link>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Análisis Fiscal</h2>
                <p className="text-gray-500 mt-1 flex items-center gap-2 font-mono text-sm bg-gray-100 w-fit px-3 py-1 rounded-md mt-3">
                    RNC: <span className="font-semibold text-gray-700">{rnc}</span>
                </p>
            </div>

            {error ? (
                <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontró información</h3>
                    <p className="text-gray-500">El contribuyente con RNC {rnc} no existe o no tiene detalles registrados.</p>
                </div>
            ) : isLoading ? (
                <div className="space-y-6 animate-pulse">
                    <div className="h-32 bg-gray-100 rounded-3xl w-full"></div>
                    <div className="h-64 bg-gray-50 rounded-2xl w-full border border-gray-100"></div>
                </div>
            ) : data ? (
                <div className="space-y-8">
                    <TotalItbisHero
                        totalItbis={data.totalItbis}
                        comprobantesCount={data.comprobantes.length}
                        formatCurrency={formatCurrency}
                    />

                    <ComprobantesTable
                        comprobantes={data.comprobantes}
                        formatCurrency={formatCurrency}
                    />
                </div>
            ) : null}
        </div>
    );
}
