import { createContext, useContext, useState, type ReactNode } from 'react';

interface ImportContextValue {
  lastBatchId: string | null;
  setLastBatchId: (id: string | null) => void;
}

const ImportContext = createContext<ImportContextValue | null>(null);

export function ImportProvider({ children }: { children: ReactNode }) {
  const [lastBatchId, setLastBatchId] = useState<string | null>(null);
  return (
    <ImportContext.Provider value={{ lastBatchId, setLastBatchId }}>
      {children}
    </ImportContext.Provider>
  );
}

export function useImportContext(): ImportContextValue {
  const ctx = useContext(ImportContext);
  if (!ctx) {
    throw new Error('useImportContext must be used within ImportProvider');
  }
  return ctx;
}
