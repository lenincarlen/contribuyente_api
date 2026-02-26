import useSWR from 'swr';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Receipt, Calculator } from 'lucide-react';
import { api } from '../services/api';

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
                    {/* Tarjeta Hero / Total */}
                    <div className="bg-gray-900 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-gray-200/50">
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-gray-300 font-medium tracking-wide text-sm mb-3">
                                <Calculator size={16} />
                                <span>TOTAL ITBIS DECLARADO</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <h1 className="text-5xl sm:text-6xl font-light tracking-tight">{formatCurrency(data.totalItbis)}</h1>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-between text-sm text-gray-400">
                                <span>Cálculo extraído de {data.comprobantes.length} comprobantes validos.</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de comprobantes */}
                    <div>
                        <div className="flex items-center gap-3 mb-6 px-1">
                            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <Receipt size={20} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Histórico de Comprobantes</h3>
                        </div>

                        {data.comprobantes.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                <p className="text-gray-500 font-medium">No existen NCF registrados para este contribuyente.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-xs font-semibold">
                                            <tr>
                                                <th className="px-6 py-4 font-medium border-b border-gray-200">Número Comprobante Fiscal (NCF)</th>
                                                <th className="px-6 py-4 font-medium border-b border-gray-200 text-right">Monto Facturado</th>
                                                <th className="px-6 py-4 font-medium border-b border-gray-200 text-right">ITBIS (18%)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.comprobantes.map((comp) => (
                                                <tr key={comp.ncf} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-gray-700 font-medium">{comp.ncf}</td>
                                                    <td className="px-6 py-4 text-right text-gray-600 font-tabular-nums">{formatCurrency(comp.monto)}</td>
                                                    <td className="px-6 py-4 text-right font-medium text-gray-900 font-tabular-nums">{formatCurrency(comp.itbis18)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
