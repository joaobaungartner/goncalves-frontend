import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface AreaChartCardProps {
  title: string;
  data: { name: string; value: number; [key: string]: number | string }[];
  dataKey?: string;
  formatValue?: (n: number) => string;
  color?: string;
}

export function AreaChartCard({
  title,
  data,
  dataKey = 'value',
  formatValue = (n) => n.toLocaleString('pt-BR'),
  color = '#3b82f6',
}: AreaChartCardProps) {
  if (!data.length) return null;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatValue} stroke="#64748b" />
          <Tooltip formatter={(value: number) => formatValue(value)} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill="url(#areaGrad)"
            name="Valor"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
