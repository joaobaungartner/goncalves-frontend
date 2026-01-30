import { config } from '../config/config';
import type {
  VisaoGeralResponse,
  SerieFaturamentoItem,
  DistribuicaoVendasProdutoItem,
  FaturamentoPorItem,
  EvolucaoFaturamentoItem,
  VolumePorCanalItem,
  VendasKpisResponse,
  RankingSegmentosItem,
  MixProdutosItem,
  ComparativoPolpaManteigaItem,
  EvolucaoMensalProdutoItem,
  PerformanceCanalItem,
  PerformanceRegiaoItem,
  ClientesPorSegmentoItem,
  NpsResponse,
  NpsSerieItem,
  LogisticaResumoResponse,
  LogisticaEvolucaoItem,
  LogisticaVsVolumeItem,
  PedidosListResponse,
  PedidosKpisResponse,
  AnalyticsMetaResponse,
} from '../types/api';

const BASE = config.apiBaseUrl;

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(path, BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** GET /dashboard/visao-geral */
export function fetchVisaoGeral(params?: {
  date_from?: string;
  date_to?: string;
  mes_atual?: number;
  ano_atual?: number;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.mes_atual != null) search.set('mes_atual', String(params.mes_atual));
  if (params?.ano_atual != null) search.set('ano_atual', String(params.ano_atual));
  const q = search.toString();
  return get<VisaoGeralResponse>(`/dashboard/visao-geral${q ? `?${q}` : ''}`);
}

/** GET /dashboard/visao-geral/serie-faturamento */
export function fetchSerieFaturamento(params?: {
  granularity?: 'day' | 'month';
  meses?: number;
}) {
  const search = new URLSearchParams();
  if (params?.granularity) search.set('granularity', params.granularity);
  if (params?.meses != null) search.set('meses', String(params.meses));
  const q = search.toString();
  return get<{ granularity: string; items: SerieFaturamentoItem[] }>(
    `/dashboard/visao-geral/serie-faturamento${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/visao-geral/distribuicao-vendas-produto */
export function fetchDistribuicaoVendasProduto(params?: {
  date_from?: string;
  date_to?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: DistribuicaoVendasProdutoItem[] }>(
    `/dashboard/visao-geral/distribuicao-vendas-produto${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/financeiro/faturamento-por-produto */
export function fetchFaturamentoPorProduto(params?: { date_from?: string; date_to?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: FaturamentoPorItem[] }>(
    `/dashboard/financeiro/faturamento-por-produto${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/financeiro/faturamento-por-canal */
export function fetchFaturamentoPorCanal(params?: { date_from?: string; date_to?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: FaturamentoPorItem[] }>(
    `/dashboard/financeiro/faturamento-por-canal${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/financeiro/evolucao-faturamento */
export function fetchEvolucaoFaturamento(params?: { granularity?: 'day' | 'month'; meses?: number }) {
  const search = new URLSearchParams();
  if (params?.granularity) search.set('granularity', params.granularity);
  if (params?.meses != null) search.set('meses', String(params.meses));
  const q = search.toString();
  return get<{ granularity: string; items: EvolucaoFaturamentoItem[] }>(
    `/dashboard/financeiro/evolucao-faturamento${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/vendas/volume-por-canal */
export function fetchVolumePorCanal(params?: { date_from?: string; date_to?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: VolumePorCanalItem[] }>(
    `/dashboard/vendas/volume-por-canal${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/vendas/kpis */
export function fetchVendasKpis(params?: { date_from?: string; date_to?: string }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  const q = search.toString();
  return get<VendasKpisResponse>(`/dashboard/vendas/kpis${q ? `?${q}` : ''}`);
}

/** GET /dashboard/vendas/ranking-segmentos */
export function fetchRankingSegmentos(params?: {
  date_from?: string;
  date_to?: string;
  ordenar_por?: 'faturamento' | 'volume_kg' | 'num_pedidos';
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.ordenar_por) search.set('ordenar_por', params.ordenar_por);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ ordenar_por: string; items: RankingSegmentosItem[] }>(
    `/dashboard/vendas/ranking-segmentos${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/vendas/mix-produtos */
export function fetchMixProdutos(params?: { date_from?: string; date_to?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: MixProdutosItem[] }>(`/dashboard/vendas/mix-produtos${q ? `?${q}` : ''}`);
}

/** GET /dashboard/produtos/comparativo-polpa-manteiga */
export function fetchComparativoPolpaManteiga(params?: { date_from?: string; date_to?: string }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  const q = search.toString();
  return get<{ items: ComparativoPolpaManteigaItem[] }>(
    `/dashboard/produtos/comparativo-polpa-manteiga${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/produtos/evolucao-mensal-por-produto */
export function fetchEvolucaoMensalPorProduto(params?: {
  date_from?: string;
  date_to?: string;
  meses?: number;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.meses != null) search.set('meses', String(params.meses));
  const q = search.toString();
  return get<{ items: EvolucaoMensalProdutoItem[] }>(
    `/dashboard/produtos/evolucao-mensal-por-produto${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/canais-mercados/performance-canal */
export function fetchPerformanceCanal(params?: { date_from?: string; date_to?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: PerformanceCanalItem[] }>(
    `/dashboard/canais-mercados/performance-canal${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/canais-mercados/performance-regiao */
export function fetchPerformanceRegiao(params?: { date_from?: string; date_to?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: PerformanceRegiaoItem[] }>(
    `/dashboard/canais-mercados/performance-regiao${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/clientes/por-segmento */
export function fetchClientesPorSegmento(params?: {
  date_from?: string;
  date_to?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: ClientesPorSegmentoItem[] }>(
    `/dashboard/clientes/por-segmento${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/qualidade-satisfacao/nps */
export function fetchNps(params?: {
  date_from?: string;
  date_to?: string;
  por_produto?: boolean;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.por_produto != null) search.set('por_produto', String(params.por_produto));
  const q = search.toString();
  return get<NpsResponse>(`/dashboard/qualidade-satisfacao/nps${q ? `?${q}` : ''}`);
}

/** GET /dashboard/qualidade-satisfacao/nps-serie */
export function fetchNpsSerie(params?: { granularity?: 'day' | 'month'; meses?: number }) {
  const search = new URLSearchParams();
  if (params?.granularity) search.set('granularity', params.granularity);
  if (params?.meses != null) search.set('meses', String(params.meses));
  const q = search.toString();
  return get<{ granularity: string; items: NpsSerieItem[] }>(
    `/dashboard/qualidade-satisfacao/nps-serie${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/logistica-custos/resumo */
export function fetchLogisticaResumo(params?: { date_from?: string; date_to?: string }) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  const q = search.toString();
  return get<LogisticaResumoResponse>(`/dashboard/logistica-custos/resumo${q ? `?${q}` : ''}`);
}

/** GET /dashboard/logistica-custos/evolucao-custo */
export function fetchLogisticaEvolucao(params?: {
  granularity?: 'day' | 'month';
  meses?: number;
}) {
  const search = new URLSearchParams();
  if (params?.granularity) search.set('granularity', params.granularity);
  if (params?.meses != null) search.set('meses', String(params.meses));
  const q = search.toString();
  return get<{ granularity: string; items: LogisticaEvolucaoItem[] }>(
    `/dashboard/logistica-custos/evolucao-custo${q ? `?${q}` : ''}`
  );
}

/** GET /dashboard/logistica-custos/logistica-vs-volume */
export function fetchLogisticaVsVolume(params?: {
  date_from?: string;
  date_to?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();
  if (params?.date_from) search.set('date_from', params.date_from);
  if (params?.date_to) search.set('date_to', params.date_to);
  if (params?.limit != null) search.set('limit', String(params.limit));
  const q = search.toString();
  return get<{ items: LogisticaVsVolumeItem[] }>(
    `/dashboard/logistica-custos/logistica-vs-volume${q ? `?${q}` : ''}`
  );
}

/** GET /pedidos */
export function fetchPedidos(params?: {
  page?: number;
  page_size?: number;
  tipo_produto?: string;
  canal?: string;
  regiao_destino?: string;
  cliente_segmento?: string;
  mes_do_ano_num?: number;
}) {
  const search = new URLSearchParams();
  if (params?.page != null) search.set('page', String(params.page));
  if (params?.page_size != null) search.set('page_size', String(params.page_size));
  if (params?.tipo_produto) search.set('tipo_produto', params.tipo_produto);
  if (params?.canal) search.set('canal', params.canal);
  if (params?.regiao_destino) search.set('regiao_destino', params.regiao_destino);
  if (params?.cliente_segmento) search.set('cliente_segmento', params.cliente_segmento);
  if (params?.mes_do_ano_num != null) search.set('mes_do_ano_num', String(params.mes_do_ano_num));
  const q = search.toString();
  return get<PedidosListResponse>(`/pedidos${q ? `?${q}` : ''}`);
}

/** GET /pedidos/kpis */
export function fetchPedidosKpis(params?: {
  tipo_produto?: string;
  mes_do_ano_num?: number;
  canal?: string;
  regiao_destino?: string;
  cliente_segmento?: string;
}) {
  const search = new URLSearchParams();
  if (params?.tipo_produto) search.set('tipo_produto', params.tipo_produto);
  if (params?.mes_do_ano_num != null) search.set('mes_do_ano_num', String(params.mes_do_ano_num));
  if (params?.canal) search.set('canal', params.canal);
  if (params?.regiao_destino) search.set('regiao_destino', params.regiao_destino);
  if (params?.cliente_segmento) search.set('cliente_segmento', params.cliente_segmento);
  const q = search.toString();
  return get<PedidosKpisResponse>(`/pedidos/kpis${q ? `?${q}` : ''}`);
}

/** GET /analytics/meta */
export function fetchAnalyticsMeta() {
  return get<AnalyticsMetaResponse>('/analytics/meta');
}
