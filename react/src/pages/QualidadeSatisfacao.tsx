import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchNps, fetchNpsSerie } from '../services/api';
import type { NpsResponse, NpsSerieItem } from '../types/api';
import { KpiCard } from '../components/ui/KpiCard';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { LineChartCard, BarChartVerticalCard } from '../components/charts';

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
  min-width: 100px;
  font-size: 0.875rem;
  color: #475569;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 20px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${({ $width }) => Math.min(100, $width * 10)}%;
  background: #3b82f6;
  border-radius: 6px;
`;

const BarValue = styled.span`
  min-width: 60px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #0f172a;
  text-align: right;
`;

export function QualidadeSatisfacao() {
  const [nps, setNps] = useState<NpsResponse | null>(null);
  const [serie, setSerie] = useState<NpsSerieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [npsPorProduto, setNpsPorProduto] = useState<NpsResponse['items']>(undefined);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchNps(), fetchNps({ por_produto: true }), fetchNpsSerie({ meses: 12 })])
      .then(([npsGlobal, npsPorProdutoRes, serieRes]) => {
        if (cancelled) return;
        setNps(npsGlobal);
        setNpsPorProduto(npsPorProdutoRes.items);
        setSerie(serieRes.items ?? []);
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
      {nps && !nps.por_produto && (
        <>
          <SectionTitle>NPS global</SectionTitle>
          <Card style={{ marginBottom: '1.5rem' }}>
            <KpiCard
              label="NPS médio"
              value={nps.nps_medio}
              format="number"
              decimals={1}
            />
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
              {nps.num_avaliacoes} avaliações
            </p>
          </Card>
        </>
      )}

      {npsPorProduto && npsPorProduto.length > 0 && (
        <>
          <SectionTitle>NPS por produto</SectionTitle>
          <Card>
            <BarChart>
              {npsPorProduto.map((item) => (
                <BarRow key={item.produto}>
                  <BarLabel>{item.produto}</BarLabel>
                  <BarTrack>
                    <BarFill $width={item.nps_medio} />
                  </BarTrack>
                  <BarValue>
                    {item.nps_medio.toFixed(1)} ({item.num_avaliacoes})
                  </BarValue>
                </BarRow>
              ))}
            </BarChart>
          </Card>
        </>
      )}

      <SectionTitle>Série NPS (últimos 12 meses)</SectionTitle>
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
                  <BarFill $width={item.nps_medio} />
                </BarTrack>
                <BarValue>{item.nps_medio.toFixed(1)}</BarValue>
              </BarRow>
            ))
          )}
        </BarChart>
      </Card>

      <LineChartCard
        title="Evolução do NPS (linha)"
        data={serie.map((s) => ({
          name: `${s.month.toString().padStart(2, '0')}/${s.year}`,
          nps: s.nps_medio,
        }))}
        dataKeys={[{ key: 'nps', name: 'NPS médio' }]}
        formatValue={(n) => n.toFixed(1)}
      />

      {npsPorProduto && npsPorProduto.length > 0 && (
        <BarChartVerticalCard
          title="NPS por produto (barras verticais)"
          data={npsPorProduto.map((p) => ({ name: p.produto, value: p.nps_medio }))}
          formatValue={(n) => n.toFixed(1)}
          barColor="#6366f1"
        />
      )}
    </PageWrapper>
  );
}
