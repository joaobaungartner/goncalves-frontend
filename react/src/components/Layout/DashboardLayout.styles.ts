import styled from 'styled-components';

export const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6f8;
`;

export const SidebarContainer = styled.aside<{ $collapsed?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $collapsed }) => ($collapsed ? '72px' : '260px')};
  min-width: ${({ $collapsed }) => ($collapsed ? '72px' : '260px')};
  background: linear-gradient(180deg, #1a2332 0%, #0f1620 100%);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, min-width 0.25s ease;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
  z-index: 10;
`;

export const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 72px;
  flex-wrap: wrap;
`;

export const Logo = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 1.125rem;
  color: white;
`;

export const BrandText = styled.span`
  font-weight: 600;
  font-size: 0.9375rem;
  color: #f8fafc;
  line-height: 1.3;
  word-break: break-word;
  overflow-wrap: break-word;
  min-width: 0;
`;

export const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const NavSection = styled.div`
  margin-bottom: 0.5rem;
`;

export const NavSectionTitle = styled.span`
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
`;

export const NavLinkStyled = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  color: ${({ $active }) => ($active ? '#f8fafc' : '#94a3b8')};
  background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.15)' : 'transparent')};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.06)')};
    color: #e2e8f0;
  }
`;

export const NavIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.125rem;
`;

export const SidebarFooter = styled.div`
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ToggleButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
  }
`;

export const MainContent = styled.main<{ $sidebarCollapsed?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: auto;
  margin-left: ${({ $sidebarCollapsed }) => ($sidebarCollapsed ? '72px' : '260px')};
  transition: margin-left 0.25s ease;
`;

export const TopBar = styled.header`
  height: 64px;
  padding: 0 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
`;

export const PageTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

export const ContentArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
`;
