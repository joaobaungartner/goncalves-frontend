import styled from 'styled-components';

export const ChartCardWrapper = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

export const ChartTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

export function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ChartCardWrapper>
      <ChartTitle>{title}</ChartTitle>
      {children}
    </ChartCardWrapper>
  );
}
