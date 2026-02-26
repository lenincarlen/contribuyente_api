import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import ListadoContribuyentes from './pages/ListadoContribuyentes';
import DetalleContribuyente from './pages/DetalleContribuyente';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 w-full max-w-6xl mx-auto">
      <header className="w-full flex items-center justify-between mb-12 pb-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:scale-105 transition-smooth">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">DGII</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Portal de Contribuyentes</p>
          </div>
        </Link>
      </header>
      <main className="w-full flex-1">
        {children}
      </main>
      <footer className="w-full mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Dirección General de Impuestos Internos. Todos los derechos reservados.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ListadoContribuyentes />} />
          <Route path="/contribuyentes/:rnc" element={<DetalleContribuyente />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
