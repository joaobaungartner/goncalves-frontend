import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import {
  LayoutWrapper,
  MainContent,
  TopBar,
  PageTitle,
  ContentArea,
} from './DashboardLayout.styles';

const pageTitles: Record<string, string> = {
  '/dashboard/visao-geral': 'Visão Geral',
  '/dashboard/financeiro': 'Financeiro',
  '/dashboard/vendas': 'Vendas',
  '/dashboard/produtos': 'Produtos',
  '/dashboard/canais-mercados': 'Canais & Mercados',
  '/dashboard/clientes': 'Clientes',
  '/dashboard/qualidade-satisfacao': 'Qualidade & Satisfação',
  '/dashboard/logistica-custos': 'Logística & Custos',
  '/importar': 'Importar dados',
  '/pedidos': 'Pedidos',
  '/analytics': 'Analytics',
};

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const title = pageTitles[pathname] ?? 'Dashboard';

  return (
    <LayoutWrapper>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <MainContent $sidebarCollapsed={sidebarCollapsed}>
        <TopBar>
          <PageTitle>{title}</PageTitle>
        </TopBar>
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutWrapper>
  );
}
