import { useState, useRef } from 'react';
import styled from 'styled-components';
import { config } from '../config/config';
import { useImportContext } from '../context/ImportContext';

const PageWrapper = styled.div`
  max-width: 640px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const InputFile = styled.input`
  display: block;
  width: 100%;
  font-size: 0.875rem;
  color: #475569;
  padding: 0.5rem 0;

  &::file-selector-button {
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    color: #0f172a;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #f1f5f9;
    }
  }
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

const ButtonRevert = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #b91c1c;
  background: transparent;
  border: 1px solid #f87171;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #ef4444;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  padding: 1.25rem 1.5rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const SuccessTitle = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const SuccessDetail = styled.div`
  color: #15803d;
  line-height: 1.5;
`;

const ErrorList = styled.div`
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.875rem;
`;

const ErrorItem = styled.div`
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ApiError = styled.div`
  padding: 1rem 1.25rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const Hint = styled.p`
  font-size: 0.8125rem;
  color: #64748b;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

const RevertNote = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.75rem 0 0 0;
  line-height: 1.4;
`;

const RevertSuccess = styled.div`
  padding: 1rem 1.25rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

/** API pode retornar inseridos como número ou por coleção */
interface InseridosByCollection {
  fatos_pedidos?: number;
  polpa_metricas?: number;
  manteiga_metricas?: number;
}

interface UploadResponse {
  batch_id?: string;
  inseridos?: number | InseridosByCollection;
  /** Ou contagens no topo da resposta */
  fatos_pedidos?: number;
  polpa_metricas?: number;
  manteiga_metricas?: number;
  erros?: string[] | Array<{ message?: string; row?: number }>;
}

function getInseridosDisplay(data: UploadResponse | null): string {
  if (!data) return '';
  const ins = data.inseridos;
  const a = typeof ins === 'number' ? ins : null;
  const obj =
    ins != null && typeof ins === 'object' && !Array.isArray(ins)
      ? (ins as InseridosByCollection)
      : null;
  const top =
    data.fatos_pedidos != null || data.polpa_metricas != null || data.manteiga_metricas != null
      ? {
          fatos_pedidos: data.fatos_pedidos ?? 0,
          polpa_metricas: data.polpa_metricas ?? 0,
          manteiga_metricas: data.manteiga_metricas ?? 0,
        }
      : null;

  if (typeof a === 'number') return `${a} registro(s) inserido(s).`;
  if (obj && (obj.fatos_pedidos != null || obj.polpa_metricas != null || obj.manteiga_metricas != null)) {
    const total =
      (obj.fatos_pedidos ?? 0) + (obj.polpa_metricas ?? 0) + (obj.manteiga_metricas ?? 0);
    const parts: string[] = [];
    if (obj.fatos_pedidos) parts.push(`${obj.fatos_pedidos} fatos`);
    if (obj.polpa_metricas) parts.push(`${obj.polpa_metricas} polpa`);
    if (obj.manteiga_metricas) parts.push(`${obj.manteiga_metricas} manteiga`);
    return parts.length ? `${total} registro(s) (${parts.join(', ')}).` : `${total} registro(s) inserido(s).`;
  }
  if (top && (top.fatos_pedidos > 0 || top.polpa_metricas > 0 || top.manteiga_metricas > 0)) {
    const total = top.fatos_pedidos + top.polpa_metricas + top.manteiga_metricas;
    const parts: string[] = [];
    if (top.fatos_pedidos) parts.push(`${top.fatos_pedidos} fatos`);
    if (top.polpa_metricas) parts.push(`${top.polpa_metricas} polpa`);
    if (top.manteiga_metricas) parts.push(`${top.manteiga_metricas} manteiga`);
    return `${total} registro(s) (${parts.join(', ')}).`;
  }
  return '';
}

function hasInseridosSuccess(data: UploadResponse | null): boolean {
  if (!data) return false;
  if (data.inseridos != null) {
    if (typeof data.inseridos === 'number') return true;
    const o = data.inseridos as InseridosByCollection;
    return o.fatos_pedidos != null || o.polpa_metricas != null || o.manteiga_metricas != null;
  }
  return (
    data.fatos_pedidos != null || data.polpa_metricas != null || data.manteiga_metricas != null
  );
}

export function Importar() {
  const { lastBatchId, setLastBatchId } = useImportContext();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [revertLoading, setRevertLoading] = useState(false);
  const [revertError, setRevertError] = useState<string | null>(null);
  const [revertSuccess, setRevertSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setFile(selected ?? null);
    setResult(null);
    setApiError(null);
    setRevertSuccess(false);
    setRevertError(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setApiError(null);
    setRevertSuccess(false);
    setRevertError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${config.apiBaseUrl}/upload/excel`, {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as UploadResponse & { detail?: string; message?: string };

      if (!res.ok) {
        const msg =
          typeof data.detail === 'string'
            ? data.detail
            : Array.isArray(data.detail)
              ? data.detail.map((d: { msg?: string }) => d.msg).join(', ')
              : data.message ?? `Erro ${res.status}`;
        setApiError(msg);
        setResult(null);
        return;
      }

      setResult(data);
      if (data.batch_id) setLastBatchId(data.batch_id);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Falha ao enviar o arquivo.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRevert = async () => {
    if (!lastBatchId) return;
    setRevertLoading(true);
    setRevertError(null);
    setRevertSuccess(false);

    try {
      const res = await fetch(`${config.apiBaseUrl}/upload/revert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch_id: lastBatchId }),
      });

      const data = await res.json().catch(() => ({})) as { detail?: string; message?: string };

      if (!res.ok) {
        const msg =
          typeof data.detail === 'string'
            ? data.detail
            : Array.isArray(data.detail)
              ? data.detail.map((d: { msg?: string }) => d.msg).join(', ')
              : data.message ?? `Erro ${res.status}`;
        setRevertError(msg);
        return;
      }

      setRevertSuccess(true);
      setLastBatchId(null);
      setResult(null);
    } catch (err) {
      setRevertError(err instanceof Error ? err.message : 'Falha ao reverter a importação.');
    } finally {
      setRevertLoading(false);
    }
  };

  const erros = result?.erros;
  const errosArray = Array.isArray(erros)
    ? erros.map((e) => (typeof e === 'string' ? e : e.message ?? `Linha ${e.row ?? '?'}`))
    : [];

  return (
    <PageWrapper>
      <Card>
        <Title>Importar dados (Excel)</Title>
        <InputWrapper>
          <InputFile
            ref={inputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            aria-label="Selecionar arquivo Excel"
          />
          <Hint>
            Apenas arquivos .xlsx. Planilhas com nome contendo &quot;Polpa&quot; ou &quot;Manteiga&quot; serão
            processadas conforme as colunas esperadas.
          </Hint>
        </InputWrapper>
        <ButtonGroup>
          <Button type="button" onClick={handleSubmit} disabled={!file || loading}>
            {loading ? 'Enviando…' : 'Enviar'}
          </Button>
          {lastBatchId && (
            <ButtonRevert type="button" onClick={handleRevert} disabled={revertLoading}>
              {revertLoading ? 'Revertendo…' : 'Reverter importação'}
            </ButtonRevert>
          )}
        </ButtonGroup>
        {lastBatchId && (
          <RevertNote>
            Só as importações feitas após a alteração têm batch_id. Dados antigos não são revertidos por este endpoint.
          </RevertNote>
        )}

        {apiError && <ApiError>{apiError}</ApiError>}
        {revertError && <ApiError>{revertError}</ApiError>}
        {revertSuccess && <RevertSuccess>Importação revertida com sucesso.</RevertSuccess>}

        {result &&
          (hasInseridosSuccess(result) ||
            result.batch_id ||
            (result.erros && result.erros.length > 0)) && (
          <>
            {(hasInseridosSuccess(result) || result.batch_id) && (
              <SuccessMessage>
                <SuccessTitle>Nova base carregada com sucesso.</SuccessTitle>
                <SuccessDetail>
                  {getInseridosDisplay(result) && (
                    <span>{getInseridosDisplay(result)}</span>
                  )}
                  {result.batch_id && (
                    <>
                      {getInseridosDisplay(result) && ' '}
                      <span>Lote: {result.batch_id}</span>
                    </>
                  )}
                </SuccessDetail>
              </SuccessMessage>
            )}
            {errosArray.length > 0 && (
              <ErrorList>
                <strong>Erros encontrados:</strong>
                {errosArray.map((msg, i) => (
                  <ErrorItem key={i}>{msg}</ErrorItem>
                ))}
              </ErrorList>
            )}
          </>
        )}
      </Card>
    </PageWrapper>
  );
}
