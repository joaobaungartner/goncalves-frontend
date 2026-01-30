import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchAnalyticsMeta } from '../services/api';
import type { AnalyticsMetaResponse } from '../types/api';
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

const CollectionBlock = styled.div`
  margin-bottom: 1.5rem;
`;

const CollectionName = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 0.5rem 0;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: #f1f5f9;
  border-radius: 6px;
  color: #475569;
`;

export function Analytics() {
  const [meta, setMeta] = useState<AnalyticsMetaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAnalyticsMeta()
      .then((data) => {
        if (!cancelled) setMeta(data);
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

  if (!meta) return null;

  return (
    <PageWrapper>
      <SectionTitle>Metadados das coleções</SectionTitle>
      <Card>
        <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#64748b' }}>
          Coleções disponíveis: {meta.collections?.join(', ') ?? '—'}
        </p>
        {meta.collections?.map((coll) => (
          <CollectionBlock key={coll}>
            <CollectionName>{coll}</CollectionName>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#64748b' }}>Campos:</p>
            <TagList>
              {(meta.fields?.[coll] ?? []).map((field) => (
                <Tag key={field}>{field}</Tag>
              ))}
            </TagList>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              Numéricos: {(meta.numeric_fields?.[coll] ?? []).join(', ') || '—'}
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              Categóricos: {(meta.categorical_fields?.[coll] ?? []).join(', ') || '—'}
            </p>
          </CollectionBlock>
        ))}
      </Card>
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
        Use os endpoints /analytics/data, /analytics/agg, /analytics/dist, /analytics/stats e
        /analytics/timeseries para consultas customizadas.
      </p>
    </PageWrapper>
  );
}
