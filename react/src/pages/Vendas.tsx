import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchVolumePorCanal,
  fetchVendasKpis,
  fetchRankingSegmentos,
  fetchMixProdutos,
} from '../services/api';
import type {
  VolumePorCanalItem,
  VendasKpisResponse,
  RankingSegmentosItem,
  MixProdutosItem,
} from '../types/api';
import { KpiCard } from '../components/ui/KpiCard';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { PieChartCard, BarChartVerticalCard } from '../components/charts';

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

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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

const BarFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${({ $width }) => Math.min(100, $width)}%;
  background: #3b82f6;
  border-radius: 6px;
  transition: width 0.3s ease;
`;

const BarValue = styled.span`
  min-width: 90px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
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

export function Vendas() {
  const [volumeCanal, setVolumeCanal] = useState<VolumePorCanalItem[]>([]);
  const [kpis, setKpis] = useState<VendasKpisResponse | null>(null);
  const [ranking, setRanking] = useState<RankingSegmentosItem[]>([]);
  const [mix, setMix] = useState<MixProdutosItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchVolumePorCanal({ limit: 15 }),
      fetchVendasKpis(),
      fetchRankingSegmentos({ ordenar_por: 'faturamento', limit: 15 }),
      fetchMixProdutos({ limit: 15 }),
    ])
      .then(([volRes, kpisRes, rankRes, mixRes]) => {
        if (cancelled) return;
        setVolumeCanal(volRes.items ?? []);
        setKpis(kpisRes);
        setRanking(rankRes.items ?? []);
        setMix(mixRes.items ?? []);
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

  const maxVolume = Math.max(...volumeCanal.map((v) => v.volume_kg), 1);

  return (
    <PageWrapper>
      {kpis && (
        <>
          <SectionTitle>Totais</SectionTitle>
          <KpiGrid>
            <KpiCard label="Volume total (kg)" value={kpis.totais.volume_kg} format="integer" />
            <KpiCard label="Nº de pedidos" value={kpis.totais.num_pedidos} format="integer" />
          </KpiGrid>
        </>
      )}

      <SectionTitle>Volume por canal</SectionTitle>
      <Card>
        <BarChart>
          {volumeCanal.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado no período.</p>
          ) : (
            volumeCanal.map((item) => (
              <BarRow key={item.canal}>
                <BarLabel>{item.canal}</BarLabel>
                <BarTrack>
                  <BarFill $width={(item.volume_kg / maxVolume) * 100} />
                </BarTrack>
                <BarValue>
                  {item.volume_kg.toLocaleString('pt-BR')} kg · {item.num_pedidos} pedidos
                </BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      {kpis && kpis.por_canal.length > 0 && (
        <>
          <SectionTitle>Participação por canal</SectionTitle>
          <Card>
            <Table>
              <thead>
                <tr>
                  <Th>Canal</Th>
                  <Th>Volume (kg)</Th>
                  <Th>Pedidos</Th>
                  <Th>Part. volume</Th>
                  <Th>Part. pedidos</Th>
                </tr>
              </thead>
              <tbody>
                {kpis.por_canal.map((row) => (
                  <tr key={row.canal}>
                    <Td>{row.canal}</Td>
                    <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                    <Td>{row.num_pedidos}</Td>
                    <Td>{row.participacao_volume_pct.toFixed(1)}%</Td>
                    <Td>{row.participacao_pedidos_pct.toFixed(1)}%</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          <PieChartCard
            title="Participação por canal (donut)"
            data={kpis.por_canal.map((c) => ({
              name: c.canal,
              value: c.volume_kg,
            }))}
            formatValue={(n) => n.toLocaleString('pt-BR')}
            innerRadius={60}
          />
        </>
      )}

      <SectionTitle>Ranking por segmento (faturamento)</SectionTitle>
      <Card>
        <BarChart>
          {ranking.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>Nenhum dado no período.</p>
          ) : (
            ranking.map((item) => (
              <BarRow key={item.segmento}>
                <BarLabel>{item.segmento}</BarLabel>
                <BarTrack>
                  <BarFill
                    $width={
                      (item.faturamento /
                        Math.max(...ranking.map((r) => r.faturamento), 1)) *
                      100
                    }
                  />
                </BarTrack>
                <BarValue>{formatBRL(item.faturamento)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <BarChartVerticalCard
        title="Ranking por segmento (barras verticais)"
        data={ranking.map((r) => ({ name: r.segmento, value: r.faturamento }))}
        formatValue={(n) => formatBRL(n)}
        barColor="#8b5cf6"
      />

      <SectionTitle>Mix de produtos</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th>Volume (kg)</Th>
              <Th>Faturamento</Th>
              <Th>Pedidos</Th>
            </tr>
          </thead>
          <tbody>
            {mix.length === 0 ? (
              <tr>
                <Td colSpan={4} style={{ color: '#64748b' }}>
                  Nenhum dado no período.
                </Td>
              </tr>
            ) : (
              mix.map((row) => (
                <tr key={row.produto}>
                  <Td>{row.produto}</Td>
                  <Td>{row.volume_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{formatBRL(row.faturamento)}</Td>
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
