import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface BarChartCardProps {
  title: string;
  data: { name: string; value: number; [key: string]: number | string }[];
  dataKey?: string;
  formatValue?: (n: number) => string;
  barColor?: string;
}

export function BarChartCard({
  title,
  data,
  dataKey = 'value',
  formatValue = (n) => n.toLocaleString('pt-BR'),
  barColor = '#3b82f6',
}: BarChartCardProps) {
  if (!data.length) return null;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={formatValue} stroke="#64748b" />
          <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 12 }} stroke="#64748b" />
          <Tooltip formatter={(value: number) => formatValue(value)} />
          <Bar dataKey={dataKey} fill={barColor} radius={[0, 4, 4, 0]} name="Valor" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/** Barras verticais (para comparar categorias no eixo X) */
export function BarChartVerticalCard({
  title,
  data,
  dataKey = 'value',
  formatValue = (n) => n.toLocaleString('pt-BR'),
  barColor = '#3b82f6',
}: BarChartCardProps) {
  if (!data.length) return null;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatValue} stroke="#64748b" />
          <Tooltip formatter={(value: number) => formatValue(value)} />
          <Bar dataKey={dataKey} fill={barColor} radius={[4, 4, 0, 0]} name="Valor" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
