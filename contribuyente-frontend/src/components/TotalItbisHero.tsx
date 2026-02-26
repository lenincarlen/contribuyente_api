import { Calculator } from 'lucide-react';

interface TotalItbisHeroProps {
    totalItbis: number;
    comprobantesCount: number;
    formatCurrency: (value: number) => string;
}

export const TotalItbisHero = ({ totalItbis, comprobantesCount, formatCurrency }: TotalItbisHeroProps) => {
    return (
        <div className="bg-white text-gray-900 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-green-50 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-500 font-medium tracking-wide text-sm mb-3">
                    <Calculator size={16} className="text-green-600" />
                    <span>TOTAL ITBIS DECLARADO</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <h1 className="text-5xl sm:text-6xl font-light tracking-tight text-gray-900">
                        {formatCurrency(totalItbis)}
                    </h1>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                    <span>Cálculo extraído de {comprobantesCount} comprobantes válidos.</span>
                </div>
            </div>
        </div>
    );
};
