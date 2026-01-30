import { NavLink } from 'react-router-dom';
import {
  SidebarContainer,
  SidebarHeader,
  Logo,
  BrandText,
  Nav,
  NavSection,
  NavSectionTitle,
  NavIcon,
  SidebarFooter,
  ToggleButton,
} from './DashboardLayout.styles';
import styled from 'styled-components';

const NavLinkWrapper = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e2e8f0;
  }

  &.active {
    color: #f8fafc;
    background: rgba(59, 130, 246, 0.15);

    &:hover {
      background: rgba(59, 130, 246, 0.2);
    }
  }
`;

const navItems = [
  {
    section: 'Dashboard',
    links: [
      { to: '/', label: 'Visão Geral', icon: '📊' },
      { to: '/dashboard/financeiro', label: 'Financeiro', icon: '💰' },
      { to: '/dashboard/vendas', label: 'Vendas', icon: '🛒' },
      { to: '/dashboard/produtos', label: 'Produtos', icon: '📦' },
      { to: '/dashboard/canais-mercados', label: 'Canais & Mercados', icon: '🌐' },
      { to: '/dashboard/clientes', label: 'Clientes', icon: '👥' },
      { to: '/dashboard/qualidade-satisfacao', label: 'Qualidade & Satisfação', icon: '⭐' },
      { to: '/dashboard/logistica-custos', label: 'Logística & Custos', icon: '🚚' },
    ],
  },
  {
    section: 'Dados',
    links: [
      { to: '/importar', label: 'Importar dados', icon: '📤' },
      { to: '/pedidos', label: 'Pedidos', icon: '📋' },
      { to: '/analytics', label: 'Analytics', icon: '📈' },
    ],
  },
] as const;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarHeader>
        <Logo>GF</Logo>
        {!collapsed && <BrandText>Golçalves Fruticultura Ltda</BrandText>}
      </SidebarHeader>

      <Nav>
        {navItems.map(({ section, links }) => (
          <NavSection key={section}>
            {!collapsed && <NavSectionTitle>{section}</NavSectionTitle>}
            {links.map(({ to, label, icon }) => (
              <NavLinkWrapper
                key={to}
                to={to}
                end={to === '/'}
                title={collapsed ? label : undefined}
              >
                <NavIcon>{icon}</NavIcon>
                {!collapsed && <span>{label}</span>}
              </NavLinkWrapper>
            ))}
          </NavSection>
        ))}
      </Nav>

      <SidebarFooter>
        <ToggleButton onClick={onToggle} title={collapsed ? 'Expandir menu' : 'Recolher menu'}>
          <span>{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>Recolher</span>}
        </ToggleButton>
      </SidebarFooter>
    </SidebarContainer>
  );
}
