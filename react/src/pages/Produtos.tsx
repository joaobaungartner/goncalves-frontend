import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchComparativoPolpaManteiga,
  fetchEvolucaoMensalPorProduto,
} from '../services/api';
import type { ComparativoPolpaManteigaItem, EvolucaoMensalProdutoItem } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { BarChartVerticalCard, LineChartCard } from '../components/charts';

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

export function Produtos() {
  const [comparativo, setComparativo] = useState<ComparativoPolpaManteigaItem[]>([]);
  const [evolucao, setEvolucao] = useState<EvolucaoMensalProdutoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchComparativoPolpaManteiga(), fetchEvolucaoMensalPorProduto({ meses: 12 })])
      .then(([compRes, evolRes]) => {
        if (cancelled) return;
        setComparativo(compRes.items ?? []);
        setEvolucao(evolRes.items ?? []);
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

  const comparativoChartData = comparativo.map((c) => ({
    name: c.produto,
    value: c.faturamento,
  }));
  const productNames = [...new Set(evolucao.map((e) => e.produto))];
  const evolucaoByMonth = evolucao.reduce(
    (acc, e) => {
      const key = `${e.month.toString().padStart(2, '0')}/${e.year}`;
      if (!acc[key]) {
        acc[key] = { name: key };
        productNames.forEach((p) => ((acc[key] as Record<string, number>)[p] = 0));
      }
      (acc[key] as Record<string, number>)[e.produto] = e.faturamento;
      return acc;
    },
    {} as Record<string, { name: string; [produto: string]: number }>
  );
  const evolucaoLineData = Object.values(evolucaoByMonth).sort((a, b) =>
    (a.name as string).localeCompare(b.name as string)
  );

  return (
    <PageWrapper>
      <BarChartVerticalCard
        title="Comparativo faturamento por produto (barras verticais)"
        data={comparativoChartData}
        formatValue={(n) => formatBRL(n)}
        barColor="#10b981"
      />

      <SectionTitle>Comparativo Polpa vs Manteiga</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th>Volume (kg)</Th>
              <Th>Faturamento</Th>
              <Th>Pedidos</Th>
              <Th>Preço médio/kg</Th>
            </tr>
          </thead>
          <tbody>
            {comparativo.length === 0 ? (
              <tr>
                <Td colSpan={5} style={{ color: '#64748b' }}>
                  Nenhum dado no período.
                </Td>
              </tr>
            ) : (
              comparativo.map((row) => (
                <tr key={row.produto}>
                  <Td>{row.produto}</Td>
                  <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{formatBRL(row.faturamento)}</Td>
                  <Td>{row.num_pedidos}</Td>
                  <Td>{formatBRL(row.preco_medio_kg)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      <SectionTitle>Evolução mensal por produto (últimos 12 meses)</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Período</Th>
              <Th>Produto</Th>
              <Th>Volume (kg)</Th>
              <Th>Faturamento</Th>
            </tr>
          </thead>
          <tbody>
            {evolucao.length === 0 ? (
              <tr>
                <Td colSpan={4} style={{ color: '#64748b' }}>
                  Nenhum dado no período.
                </Td>
              </tr>
            ) : (
              evolucao.slice(0, 30).map((row, i) => (
                <tr key={`${row.year}-${row.month}-${row.produto}-${i}`}>
                  <Td>
                    {row.month.toString().padStart(2, '0')}/{row.year}
                  </Td>
                  <Td>{row.produto}</Td>
                  <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{formatBRL(row.faturamento)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {evolucaoLineData.length > 0 && productNames.length > 0 && (
        <LineChartCard
          title="Evolução do faturamento por produto (linha)"
          data={evolucaoLineData}
          dataKeys={productNames.map((name) => ({ key: name, name }))}
          formatValue={(n) => formatBRL(n)}
        />
      )}
    </PageWrapper>
  );
}
