import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchPedidos, fetchPedidosKpis } from '../services/api';
import type { PedidosListResponse, PedidosKpisResponse } from '../types/api';
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
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
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
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(n);
}

export function Pedidos() {
  const [list, setList] = useState<PedidosListResponse | null>(null);
  const [kpis, setKpis] = useState<PedidosKpisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchPedidos({ page: 1, page_size: 50 }), fetchPedidosKpis()])
      .then(([listRes, kpisRes]) => {
        if (cancelled) return;
        setList(listRes);
        setKpis(kpisRes);
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

  const items = list?.items ?? [];

  return (
    <PageWrapper>
      {kpis && (
        <>
          <SectionTitle>KPIs</SectionTitle>
          <KpiGrid>
            <KpiCard label="Pedidos" value={kpis.pedidos} format="integer" />
            <KpiCard label="Volume total (kg)" value={kpis.volume_total_kg} format="integer" />
            <KpiCard label="Receita estimada" value={kpis.receita_estimada_total} format="currency" />
            <KpiCard
              label="Preço médio"
              value={kpis.preco_medio ?? 0}
              format="currency"
            />
            <KpiCard
              label="NPS médio"
              value={kpis.nps_medio ?? 0}
              format="number"
              decimals={1}
            />
          </KpiGrid>
        </>
      )}

      <SectionTitle>Lista de pedidos (paginada)</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Data</Th>
              <Th>Produto</Th>
              <Th>Canal</Th>
              <Th>Região</Th>
              <Th>Qtd (kg)</Th>
              <Th>Preço/kg</Th>
              <Th>NPS</Th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <Td colSpan={8} style={{ color: '#64748b' }}>
                  Nenhum pedido encontrado.
                </Td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id_pedido}>
                  <Td>{row.id_pedido}</Td>
                  <Td>{new Date(row.data_pedido).toLocaleDateString('pt-BR')}</Td>
                  <Td>{row.tipo_produto}</Td>
                  <Td>{row.canal}</Td>
                  <Td>{row.regiao_destino}</Td>
                  <Td>{row.quantidade_kg.toLocaleString('pt-BR')}</Td>
                  <Td>{formatBRL(row.preco_unitario_brl_kg)}</Td>
                  <Td>{row.nps_0a10 ?? '—'}</Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        {list && (
          <p style={{ margin: '1rem 0 0', fontSize: '0.8125rem', color: '#64748b' }}>
            Página {list.page} · {list.items.length} de {list.total} pedidos
          </p>
        )}
      </Card>
    </PageWrapper>
  );
}
