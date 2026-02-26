import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import logo from '../assets/logo.png';

export const Header = () => {
    return (
        <header className="w-full flex items-center justify-between mb-12 pb-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <Logo src={logo} />
                </Link>
                <nav className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                    >
                        Contribuyentes
                    </Link>
                    <a
                        href="https://dgii.gov.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        Sede Oficial
                    </a>
                </nav>
            </div>
        </header>
    );
};
