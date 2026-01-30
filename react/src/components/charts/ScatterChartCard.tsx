import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface ScatterPoint {
  x: number;
  y: number;
  z?: number;
  name?: string;
}

interface ScatterChartCardProps {
  title: string;
  data: ScatterPoint[];
  xName?: string;
  yName?: string;
  formatX?: (n: number) => string;
  formatY?: (n: number) => string;
}

export function ScatterChartCard({
  title,
  data,
  xName = 'x',
  yName = 'y',
  formatX = (n) => n.toLocaleString('pt-BR'),
  formatY = (n) => n.toLocaleString('pt-BR'),
}: ScatterChartCardProps) {
  if (!data.length) return null;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="x" name={xName} tick={{ fontSize: 11 }} tickFormatter={formatX} />
          <YAxis dataKey="y" name={yName} tick={{ fontSize: 11 }} tickFormatter={formatY} />
          <ZAxis type="number" dataKey="z" range={[80, 400]} name="Tamanho" />
          <Tooltip
            formatter={(value: number, name: string) => [name === 'x' ? formatX(value) : formatY(value), name]}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter name="Pedidos" data={data} fill="#3b82f6" fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
