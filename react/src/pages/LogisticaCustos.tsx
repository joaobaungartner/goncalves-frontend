import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchLogisticaResumo } from '../services/api';
import type { LogisticaResumoResponse } from '../types/api';
import { KpiCard } from '../components/ui/KpiCard';
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

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

export function LogisticaCustos() {
  const [resumo, setResumo] = useState<LogisticaResumoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchLogisticaResumo()
      .then((data) => {
        if (!cancelled) setResumo(data);
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
    </PageWrapper>
  );
}
