/** Respostas da Dashboard Abramides API */

export interface VisaoGeralResponse {
  mes_atual: { year: number; month: number };
  kpis_atual: {
    faturamento_total: number;
    volume_kg: number;
    num_pedidos: number;
    ticket_medio: number;
    nps_medio: number | null;
  };
  kpis_mes_anterior: {
    faturamento_total: number;
    volume_kg: number;
    num_pedidos: number;
    ticket_medio: number;
    nps_medio: number | null;
  };
  variacao_pct: {
    faturamento: number | null;
    volume_kg: number | null;
    num_pedidos: number | null;
    ticket_medio: number | null;
    nps_medio: number | null;
  };
}

export interface SerieFaturamentoItem {
  year: number;
  month: number;
  day?: number;
  faturamento: number;
}

export interface DistribuicaoVendasProdutoItem {
  produto: string;
  faturamento: number;
  volume_kg: number;
}

export interface FaturamentoPorItem {
  produto?: string;
  canal?: string;
  regiao?: string;
  faturamento: number;
}

export interface EvolucaoFaturamentoItem {
  year: number;
  month: number;
  day?: number;
  faturamento: number;
}

export interface VolumePorCanalItem {
  canal: string;
  volume_kg: number;
  num_pedidos: number;
}

export interface VendasKpisResponse {
  totais: { volume_kg: number; num_pedidos: number };
  por_canal: Array<{
    canal: string;
    volume_kg: number;
    num_pedidos: number;
    participacao_volume_pct: number;
    participacao_pedidos_pct: number;
  }>;
}

export interface RankingSegmentosItem {
  segmento: string;
  faturamento: number;
  volume_kg: number;
  num_pedidos: number;
}

export interface MixProdutosItem {
  produto: string;
  volume_kg: number;
  faturamento: number;
  num_pedidos: number;
}

export interface ComparativoPolpaManteigaItem {
  produto: string;
  volume_kg: number;
  faturamento: number;
  num_pedidos: number;
  preco_medio_kg: number;
}

export interface EvolucaoMensalProdutoItem {
  year: number;
  month: number;
  produto: string;
  volume_kg: number;
  faturamento: number;
}

export interface PerformanceCanalItem {
  canal: string;
  faturamento: number;
  volume_kg: number;
  num_pedidos: number;
}

export interface PerformanceRegiaoItem {
  regiao: string;
  faturamento: number;
  volume_kg: number;
  num_pedidos: number;
}

export interface ClientesPorSegmentoItem {
  segmento: string;
  faturamento: number;
  volume_kg: number;
  num_pedidos: number;
  ticket_medio: number;
}

export interface NpsResponse {
  nps_medio: number;
  num_avaliacoes: number;
  por_produto?: boolean;
  items?: Array<{ produto: string; nps_medio: number; num_avaliacoes: number }>;
}

export interface NpsSerieItem {
  year: number;
  month: number;
  day?: number;
  nps_medio: number;
}

export interface LogisticaResumoResponse {
  custo_logistico_total: number;
  custo_logistico_medio: number;
  receita_total: number;
  custo_vs_receita_pct: number;
  num_pedidos: number;
}

export interface LogisticaEvolucaoItem {
  year: number;
  month: number;
  day?: number;
  custo_logistico: number;
  num_pedidos: number;
}

export interface LogisticaVsVolumeItem {
  id_pedido: string;
  volume_kg: number;
  custo_logistico: number;
  receita_estimada: number;
}

export interface PedidosListResponse {
  page: number;
  page_size: number;
  total: number;
  items: Array<{
    id_pedido: string;
    data_pedido: string;
    tipo_produto: string;
    canal: string;
    regiao_destino: string;
    cliente_segmento: string;
    quantidade_kg: number;
    preco_unitario_brl_kg: number;
    nps_0a10?: number;
    mes_do_ano_num: number;
    mes_do_ano?: string;
  }>;
}

export interface PedidosKpisResponse {
  pedidos: number;
  volume_total_kg: number;
  receita_estimada_total: number;
  preco_medio: number | null;
  nps_medio: number | null;
}

export interface AnalyticsMetaResponse {
  collections: string[];
  fields: Record<string, string[]>;
  numeric_fields: Record<string, string[]>;
  categorical_fields: Record<string, string[]>;
}
