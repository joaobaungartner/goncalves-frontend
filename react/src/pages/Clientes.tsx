import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchClientesPorSegmento } from '../services/api';
import type { ClientesPorSegmentoItem } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';

const PageWrapper = styled.div`
  max-width: 1200px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  color: #0f172a;
`;

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

export function Clientes() {
  const [items, setItems] = useState<ClientesPorSegmentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchClientesPorSegmento({ limit: 30 })
      .then((res) => {
        if (!cancelled) setItems(res.items ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageWrapper>
      <SectionTitle>Por segmento de cliente</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Segmento</Th>
              <Th>Faturamento</Th>
              <Th>Volume (kg)</Th>
              <Th>Pedidos</Th>
              <Th>Ticket médio</Th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <Td colSpan={5} style={{ color: '#64748b' }}>
                  Nenhum dado no período.
                </Td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.segmento}>
                  <Td>{row.segmento}</Td>
                  <Td>{formatBRL(row.faturamento)}</Td>
                  <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{row.num_pedidos}</Td>
                  <Td>{formatBRL(row.ticket_medio)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </PageWrapper>
  );
}
