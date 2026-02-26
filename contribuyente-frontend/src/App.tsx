import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import ListadoContribuyentes from './pages/ListadoContribuyentes';
import DetalleContribuyente from './pages/DetalleContribuyente';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 w-full">
      <Header />
      <main className="w-full max-w-6xl mx-auto flex-1">
        {children}
      </main>
      <footer className="w-full max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Dirección General de Impuestos Internos. Dominicana.
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
