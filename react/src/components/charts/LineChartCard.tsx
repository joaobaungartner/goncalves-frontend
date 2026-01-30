import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartCard } from './ChartCard';

const COLORS = ['#f97316', '#10b981', '#f59e0b'];

interface DataItem {
  name: string;
  [key: string]: number | string;
}

interface LineChartCardProps {
  title: string;
  data: DataItem[];
  dataKeys: { key: string; color?: string; name?: string }[];
  xAxisKey?: string;
  formatValue?: (n: number) => string;
}

export function LineChartCard({
  title,
  data,
  dataKeys,
  xAxisKey = 'name',
  formatValue = (n) => n.toLocaleString('pt-BR'),
}: LineChartCardProps) {
  if (!data.length) return null;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tick={{ fontSize: 12 }} stroke="#64748b" tickFormatter={formatValue} />
          <Tooltip
            formatter={(value: number) => formatValue(value)}
            contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
            labelStyle={{ color: '#0f172a' }}
          />
          {dataKeys.map(({ key, color, name }, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              name={name ?? key}
              stroke={color ?? COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
