import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartCard } from './ChartCard';

const COLORS = ['#f97316', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
  formatValue?: (n: number) => string;
  innerRadius?: number; // donut: 60, pizza: 0
}

export function PieChartCard({
  title,
  data,
  formatValue = (n) => n.toLocaleString('pt-BR'),
  innerRadius = 60,
}: PieChartCardProps) {
  if (!data.length) return null;

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatValue(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
