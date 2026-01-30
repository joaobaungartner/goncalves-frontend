import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchPerformanceCanal, fetchPerformanceRegiao } from '../services/api';
import type { PerformanceCanalItem, PerformanceRegiaoItem } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { PieChartCard } from '../components/charts';

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

export function CanaisMercados() {
  const [canais, setCanais] = useState<PerformanceCanalItem[]>([]);
  const [regioes, setRegioes] = useState<PerformanceRegiaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchPerformanceCanal({ limit: 20 }), fetchPerformanceRegiao({ limit: 20 })])
      .then(([canalRes, regiaoRes]) => {
        if (cancelled) return;
        setCanais(canalRes.items ?? []);
        setRegioes(regiaoRes.items ?? []);
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
      <PieChartCard
        title="Faturamento por canal (donut)"
        data={canais.map((c) => ({ name: c.canal, value: c.faturamento }))}
        formatValue={(n) => formatBRL(n)}
        innerRadius={60}
      />

      <PieChartCard
        title="Faturamento por região (pizza)"
        data={regioes.map((r) => ({ name: r.regiao, value: r.faturamento }))}
        formatValue={(n) => formatBRL(n)}
        innerRadius={0}
      />

      <SectionTitle>Performance por canal</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Canal</Th>
              <Th>Faturamento</Th>
              <Th>Volume (kg)</Th>
              <Th>Pedidos</Th>
            </tr>
          </thead>
          <tbody>
            {canais.length === 0 ? (
              <tr>
                <Td colSpan={4} style={{ color: '#64748b' }}>
                  Nenhum dado no período.
                </Td>
              </tr>
            ) : (
              canais.map((row) => (
                <tr key={row.canal}>
                  <Td>{row.canal}</Td>
                  <Td>{formatBRL(row.faturamento)}</Td>
                  <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{row.num_pedidos}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <SectionTitle>Performance por região</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Região</Th>
              <Th>Faturamento</Th>
              <Th>Volume (kg)</Th>
              <Th>Pedidos</Th>
            </tr>
          </thead>
          <tbody>
            {regioes.length === 0 ? (
              <tr>
                <Td colSpan={4} style={{ color: '#64748b' }}>
                  Nenhum dado no período.
                </Td>
              </tr>
            ) : (
              regioes.map((row) => (
                <tr key={row.regiao}>
                  <Td>{row.regiao}</Td>
                  <Td>{formatBRL(row.faturamento)}</Td>
                  <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{row.num_pedidos}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </PageWrapper>
  );
}
