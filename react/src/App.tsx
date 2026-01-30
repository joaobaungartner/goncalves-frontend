import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/Layout/DashboardLayout';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<VisaoGeral />} />
          <Route path="dashboard/financeiro" element={<Financeiro />} />
          <Route path="dashboard/vendas" element={<Vendas />} />
          <Route path="dashboard/produtos" element={<Produtos />} />
          <Route path="dashboard/canais-mercados" element={<CanaisMercados />} />
          <Route path="dashboard/clientes" element={<Clientes />} />
          <Route path="dashboard/qualidade-satisfacao" element={<QualidadeSatisfacao />} />
          <Route path="dashboard/logistica-custos" element={<LogisticaCustos />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
