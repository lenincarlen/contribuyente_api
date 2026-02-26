import { Receipt } from 'lucide-react';

import type { Comprobante } from '../types/contribuyente';

interface ComprobantesTableProps {
    comprobantes: Comprobante[];
    formatCurrency: (value: number) => string;
}

export const ComprobantesTable = ({ comprobantes, formatCurrency }: ComprobantesTableProps) => {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6 px-1">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                    <Receipt size={20} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Histórico de Comprobantes</h3>
            </div>

            {comprobantes.length === 0 ? (
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
                                {comprobantes.map((comp) => (
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
    );
};
