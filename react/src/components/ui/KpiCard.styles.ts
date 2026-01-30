import styled from 'styled-components';

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

export const Label = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.25rem;
`;

export const Value = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
`;

export const Variation = styled.span<{ $positive?: boolean; $negative?: boolean }>`
  font-size: 0.8125rem;
  font-weight: 500;
  margin-left: 0.5rem;
  color: ${({ $positive, $negative }) =>
    $positive ? '#059669' : $negative ? '#dc2626' : '#64748b'};
`;
