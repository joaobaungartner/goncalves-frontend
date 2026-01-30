import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchVisaoGeral,
  fetchSerieFaturamento,
  fetchDistribuicaoVendasProduto,
} from '../services/api';
import type { VisaoGeralResponse, SerieFaturamentoItem, DistribuicaoVendasProdutoItem } from '../types/api';
import { KpiCard } from '../components/ui/KpiCard';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LineChartCard, PieChartCard } from '../components/charts';

const PageWrapper = styled.div`
  max-width: 1200px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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
  min-width: 140px;
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

const BarFill = styled.div<{ $width: number; $color?: string }>`
  height: 100%;
  width: ${({ $width }) => Math.min(100, $width)}%;
  background: ${({ $color }) => $color ?? '#f97316'};
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const BarValue = styled.span`
  min-width: 80px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
`;

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

export function VisaoGeral() {
  const [visao, setVisao] = useState<VisaoGeralResponse | null>(null);
  const [serie, setSerie] = useState<SerieFaturamentoItem[]>([]);
  const [distribuicao, setDistribuicao] = useState<DistribuicaoVendasProdutoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchVisaoGeral(),
      fetchSerieFaturamento({ granularity: 'month', meses: 12 }),
      fetchDistribuicaoVendasProduto({ limit: 10 }),
    ])
      .then(([visaoRes, serieRes, distRes]) => {
        if (cancelled) return;
        setVisao(visaoRes);
        setSerie(serieRes.items ?? []);
        setDistribuicao(distRes.items ?? []);
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

  const maxFaturamento = Math.max(...distribuicao.map((d) => d.faturamento), 1);
  const maxSerie = Math.max(...serie.map((s) => s.faturamento), 1);

  return (
    <PageWrapper>
      <SectionTitle>KPIs — Período atual vs mês anterior</SectionTitle>
      {visao && (
        <KpiGrid>
          <KpiCard
            label="Faturamento"
            value={visao.kpis_atual.faturamento_total}
            variation={visao.variacao_pct.faturamento}
            format="currency"
          />
          <KpiCard
            label="Volume (kg)"
            value={visao.kpis_atual.volume_kg}
            variation={visao.variacao_pct.volume_kg}
            format="integer"
          />
          <KpiCard
            label="Pedidos"
            value={visao.kpis_atual.num_pedidos}
            variation={visao.variacao_pct.num_pedidos}
            format="integer"
          />
          <KpiCard
            label="Ticket médio"
            value={visao.kpis_atual.ticket_medio}
            variation={visao.variacao_pct.ticket_medio}
            format="currency"
          />
          <KpiCard
            label="NPS médio"
            value={visao.kpis_atual.nps_medio ?? 0}
            variation={visao.variacao_pct.nps_medio}
            format="number"
            decimals={1}
          />
        </KpiGrid>
      )}

      <SectionTitle>Série de faturamento (últimos 12 meses)</SectionTitle>
      <Card>
        <BarChart>
          {serie.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado no período.</p>
          ) : (
            serie.map((item, i) => (
              <BarRow key={`${item.year}-${item.month}-${i}`}>
                <BarLabel>
                  {item.month.toString().padStart(2, '0')}/{item.year}
                </BarLabel>
                <BarTrack>
                  <BarFill $width={(item.faturamento / maxSerie) * 100} />
                </BarTrack>
                <BarValue>{formatBRL(item.faturamento)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <LineChartCard
        title="Evolução do faturamento (linha)"
        data={serie.map((s) => ({
          name: `${s.month.toString().padStart(2, '0')}/${s.year}`,
          faturamento: s.faturamento,
        }))}
        dataKeys={[{ key: 'faturamento', name: 'Faturamento' }]}
        formatValue={(n) => formatBRL(n)}
      />

      <SectionTitle>Distribuição de vendas por produto</SectionTitle>
      <Card>
        <BarChart>
          {distribuicao.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado.</p>
          ) : (
            distribuicao.map((item) => (
              <BarRow key={item.produto}>
                <BarLabel>{item.produto}</BarLabel>
                <BarTrack>
                  <BarFill $width={(item.faturamento / maxFaturamento) * 100} />
                </BarTrack>
                <BarValue>{formatBRL(item.faturamento)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <PieChartCard
        title="Participação por produto (donut)"
        data={distribuicao.map((d) => ({ name: d.produto, value: d.faturamento }))}
        formatValue={(n) => formatBRL(n)}
        innerRadius={60}
      />
    </PageWrapper>
  );
}
