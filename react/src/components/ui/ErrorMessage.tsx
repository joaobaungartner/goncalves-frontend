import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 1rem 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.875rem;
`;

export function ErrorMessage({ message }: { message: string }) {
  return <Wrapper>{message}</Wrapper>;
}
