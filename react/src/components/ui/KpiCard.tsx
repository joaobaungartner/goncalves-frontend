import { Card, Label, Value, Variation } from './KpiCard.styles';

function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatNumber(n: number, decimals = 0) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(n);
}

interface KpiCardProps {
  label: string;
  value: number | string;
  variation?: number | null;
  format?: 'currency' | 'number' | 'integer' | 'percent';
  decimals?: number;
}

export function KpiCard({ label, value, variation, format = 'number', decimals }: KpiCardProps) {
  let displayValue: string;
  if (typeof value === 'string') {
    displayValue = value;
  } else if (format === 'currency') {
    displayValue = formatBRL(value);
  } else if (format === 'percent') {
    displayValue = `${formatNumber(value, decimals ?? 1)}%`;
  } else if (format === 'integer') {
    displayValue = formatNumber(Math.round(value), 0);
  } else {
    displayValue = formatNumber(value, decimals ?? 2);
  }

  const varNum = variation != null ? Number(variation) : null;
  const hasVar = varNum !== null && !Number.isNaN(varNum);
  const varPositive = hasVar && varNum! > 0;
  const varNegative = hasVar && varNum! < 0;

  return (
    <Card>
      <Label>{label}</Label>
      <Value>
        {displayValue}
        {hasVar && (
          <Variation $positive={varPositive} $negative={varNegative}>
            ({varNum! > 0 ? '+' : ''}{formatNumber(varNum!, 2)}%)
          </Variation>
        )}
      </Value>
    </Card>
  );
}
