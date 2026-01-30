import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchFaturamentoPorProduto,
  fetchFaturamentoPorCanal,
  fetchEvolucaoFaturamento,
} from '../services/api';
import type { FaturamentoPorItem, EvolucaoFaturamentoItem } from '../types/api';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { PieChartCard, AreaChartCard } from '../components/charts';

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

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BarLabel = styled.span`
  min-width: 160px;
  font-size: 0.875rem;
  color: #475569;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 24px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${({ $width }) => Math.min(100, $width)}%;
  background: #3b82f6;
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const BarValue = styled.span`
  min-width: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
`;

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

export function Financeiro() {
  const [porProduto, setPorProduto] = useState<FaturamentoPorItem[]>([]);
  const [porCanal, setPorCanal] = useState<FaturamentoPorItem[]>([]);
  const [evolucao, setEvolucao] = useState<EvolucaoFaturamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchFaturamentoPorProduto({ limit: 15 }),
      fetchFaturamentoPorCanal({ limit: 15 }),
      fetchEvolucaoFaturamento({ granularity: 'month', meses: 12 }),
    ])
      .then(([prodRes, canalRes, evolRes]) => {
        if (cancelled) return;
        setPorProduto(prodRes.items ?? []);
        setPorCanal(canalRes.items ?? []);
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

  const maxProduto = Math.max(...porProduto.map((p) => p.faturamento), 1);
  const maxCanal = Math.max(...porCanal.map((c) => c.faturamento), 1);
  const maxEvolucao = Math.max(...evolucao.map((e) => e.faturamento), 1);

  return (
    <PageWrapper>
      <SectionTitle>Faturamento por produto</SectionTitle>
      <Card>
        <BarChart>
          {porProduto.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado no período.</p>
          ) : (
            porProduto.map((item) => (
              <BarRow key={item.produto ?? 'n/a'}>
                <BarLabel>{item.produto ?? '—'}</BarLabel>
                <BarTrack>
                  <BarFill $width={(item.faturamento / maxProduto) * 100} />
                </BarTrack>
                <BarValue>{formatBRL(item.faturamento)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <SectionTitle>Faturamento por canal</SectionTitle>
      <Card>
        <BarChart>
          {porCanal.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado no período.</p>
          ) : (
            porCanal.map((item) => (
              <BarRow key={item.canal ?? 'n/a'}>
                <BarLabel>{item.canal ?? '—'}</BarLabel>
                <BarTrack>
                  <BarFill $width={(item.faturamento / maxCanal) * 100} />
                </BarTrack>
                <BarValue>{formatBRL(item.faturamento)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <SectionTitle>Evolução do faturamento (últimos 12 meses)</SectionTitle>
      <Card>
        <BarChart>
          {evolucao.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado no período.</p>
          ) : (
            evolucao.map((item, i) => (
              <BarRow key={`${item.year}-${item.month}-${i}`}>
                <BarLabel>
                  {item.month.toString().padStart(2, '0')}/{item.year}
                </BarLabel>
                <BarTrack>
                  <BarFill $width={(item.faturamento / maxEvolucao) * 100} />
                </BarTrack>
                <BarValue>{formatBRL(item.faturamento)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <PieChartCard
        title="Faturamento por produto (pizza)"
        data={porProduto.map((p) => ({ name: p.produto ?? '—', value: p.faturamento }))}
        formatValue={(n) => formatBRL(n)}
        innerRadius={0}
      />

      <PieChartCard
        title="Faturamento por canal (donut)"
        data={porCanal.map((c) => ({ name: c.canal ?? '—', value: c.faturamento }))}
        formatValue={(n) => formatBRL(n)}
        innerRadius={60}
      />

      <AreaChartCard
        title="Evolução do faturamento (área)"
        data={evolucao.map((e) => ({
          name: `${e.month.toString().padStart(2, '0')}/${e.year}`,
          value: e.faturamento,
        }))}
        formatValue={(n) => formatBRL(n)}
        color="#10b981"
      />
    </PageWrapper>
  );
}
