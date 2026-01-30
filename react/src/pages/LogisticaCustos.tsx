import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  fetchLogisticaResumo,
  fetchLogisticaEvolucao,
  fetchLogisticaVsVolume,
} from '../services/api';
import type {
  LogisticaResumoResponse,
  LogisticaEvolucaoItem,
  LogisticaVsVolumeItem,
} from '../types/api';
import { KpiCard } from '../components/ui/KpiCard';
import { Loading } from '../components/ui/Loading';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { AreaChartCard, ScatterChartCard } from '../components/charts';

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
`;

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
}

export function LogisticaCustos() {
  const [resumo, setResumo] = useState<LogisticaResumoResponse | null>(null);
  const [evolucao, setEvolucao] = useState<LogisticaEvolucaoItem[]>([]);
  const [vsVolume, setVsVolume] = useState<LogisticaVsVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchLogisticaResumo(),
      fetchLogisticaEvolucao({ granularity: 'month', meses: 12 }),
      fetchLogisticaVsVolume({ limit: 150 }),
    ])
      .then(([resumoData, evolRes, vsRes]) => {
        if (cancelled) return;
        setResumo(resumoData);
        setEvolucao(evolRes.items ?? []);
        setVsVolume(vsRes.items ?? []);
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

  if (!resumo) return null;

  return (
    <PageWrapper>
      <SectionTitle>Resumo — Custo logístico (pedidos de Polpa)</SectionTitle>
      <KpiGrid>
        <KpiCard label="Custo logístico total" value={resumo.custo_logistico_total} format="currency" />
        <KpiCard label="Custo logístico médio" value={resumo.custo_logistico_medio} format="currency" />
        <KpiCard label="Receita total" value={resumo.receita_total} format="currency" />
        <KpiCard
          label="Custo vs receita"
          value={resumo.custo_vs_receita_pct}
          format="percent"
          decimals={2}
        />
        <KpiCard label="Nº de pedidos" value={resumo.num_pedidos} format="integer" />
      </KpiGrid>

      <AreaChartCard
        title="Evolução do custo logístico (área)"
        data={evolucao.map((e) => ({
          name: `${e.month.toString().padStart(2, '0')}/${e.year}`,
          value: e.custo_logistico,
        }))}
        formatValue={(n) => formatBRL(n)}
        color="#dc2626"
      />

      <ScatterChartCard
        title="Custo logístico × Volume (dispersão)"
        data={vsVolume.map((p) => ({
          x: p.volume_kg,
          y: p.custo_logistico,
          name: p.id_pedido,
        }))}
        xName="Volume (kg)"
        yName="Custo (R$)"
        formatX={(n) => n.toLocaleString('pt-BR')}
        formatY={(n) => formatBRL(n)}
      />
    </PageWrapper>
  );
}
