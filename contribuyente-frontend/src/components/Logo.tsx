import { Building2 } from 'lucide-react';

interface LogoProps {
    src?: string;
}

export const Logo = ({ src }: LogoProps) => (
    <div className="flex items-center gap-3 group">
        <div className="w-10 h-10 flex items-center justify-center   overflow-hidden group-hover:scale-105 transition-all duration-300 ">
            {src ? (
                <img src={src} alt="DGII Logo" className="w-full h-full object-contain p-1" />
            ) : (
                <div className="bg-green-600 w-full h-full flex items-center justify-center text-white">
                    <Building2 size={20} />
                </div>
            )}
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">DGII</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-1">Portal de Contribuyentes</p>
        </div>
    </div>
);
