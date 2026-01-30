import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ImportProvider } from './context/ImportContext';
import { useAuth } from './context/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { Login } from './pages/Login';
import { VisaoGeral } from './pages/VisaoGeral';
import { Financeiro } from './pages/Financeiro';
import { Vendas } from './pages/Vendas';
import { Produtos } from './pages/Produtos';
import { CanaisMercados } from './pages/CanaisMercados';
import { Clientes } from './pages/Clientes';
import { QualidadeSatisfacao } from './pages/QualidadeSatisfacao';
import { LogisticaCustos } from './pages/LogisticaCustos';
import { Pedidos } from './pages/Pedidos';
import { Analytics } from './pages/Analytics';
import { Importar } from './pages/Importar';

/** Em /: se autenticado redireciona para o dashboard; senão mostra Login. */
function LoginOrRedirect() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard/visao-geral" replace />;
  }
  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <ImportProvider>
        <Routes>
          <Route path="/" element={<LoginOrRedirect />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="visao-geral" replace />} />
            <Route path="visao-geral" element={<VisaoGeral />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="vendas" element={<Vendas />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="canais-mercados" element={<CanaisMercados />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="qualidade-satisfacao" element={<QualidadeSatisfacao />} />
            <Route path="logistica-custos" element={<LogisticaCustos />} />
          </Route>
          <Route
            path="/importar"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Importar />} />
          </Route>
          <Route
            path="/pedidos"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Pedidos />} />
          </Route>
          <Route
            path="/analytics"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ImportProvider>
    </BrowserRouter>
  );
}

export default App;
