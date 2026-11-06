import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

interface RecordItem {
  id: string;
  targetUrl: string;
  status: 'PENDING' | 'CAPTURING' | 'COMPLETED' | 'FAILED';
  captureType: string;
  sha256Hash?: string;
  serverIp?: string;
  capturedAt?: string;
  createdAt: string;
}

interface RecordDetails {
  record: RecordItem & {
    filePath?: string;
    httpHeaders?: Record<string, string>;
  };
  isIntegrityValid: boolean;
}

export const DashboardPage: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<RecordDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchRecords = async () => {
    try {
      const data = await apiRequest('/records');
      setRecords(data.records || []);
    } catch (err: any) {
      console.error('Erro ao buscar registros:', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // REQ 08 + REQ 11: Iniciar e concluir captura de prova digital
  const handleStartCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;

    setError('');
    setLoading(true);

    try {
      // 1. REQ 08: Iniciar registro de conteúdo
      const createRes = await apiRequest('/records', {
        method: 'POST',
        body: JSON.stringify({ targetUrl, captureType: 'SCREENSHOT' }),
      });

      const recordId = createRes.record.id;

      // 2. REQ 11: Executar captura headless e calcular SHA-256
      await apiRequest(`/records/${recordId}/capture`, {
        method: 'POST',
      });

      setTargetUrl('');
      await fetchRecords();
      handleViewDetails(recordId);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar captura da prova.');
      await fetchRecords();
    } finally {
      setLoading(false);
    }
  };

  // REQ 13: Visualizar detalhes do registro e integridade
  const handleViewDetails = async (recordId: string) => {
    setLoadingDetails(true);
    try {
      const data = await apiRequest(`/records/${recordId}`);
      setSelectedRecord(data);
    } catch (err: any) {
      alert(`Erro ao carregar detalhes: ${err.message}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getEvidenceImageUrl = (recordId: string) => {
    const token = localStorage.getItem('@veridit:token');
    return `http://localhost:8000/api/records/${recordId}/file?token=${token}`;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Seção de Nova Captura (REQ 08 e 11) */}
      <section style={{ backgroundColor: '#1e293b', padding: '1.75rem', borderRadius: '12px', border: '1px solid #334155', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          🛡️ Novo Registro Probatório de Conteúdo Web
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Informe a URL da página web a ser capturada. O sistema abrirá um navegador isolado, extrairá os metadados técnicos de conexão e gerará o hash SHA-256 da prova.
        </p>

        {error && (
          <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleStartCapture} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="url"
            required
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://exemplo.com.br/pagina-com-conteudo"
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              backgroundColor: '#0f172a',
              border: '1px solid #475569',
              color: '#fff',
              fontSize: '0.95rem'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              backgroundColor: loading ? '#475569' : '#2563eb',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap'
            }}
          >
            {loading ? 'Capturando evidência...' : 'Iniciar Captura'}
          </button>
        </form>
      </section>

      {/* Grid: Lista de Registros + Detalhes do Registro Selecionado */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedRecord ? '1fr 1.2fr' : '1fr', gap: '2rem' }}>
        {/* Lista de Registros */}
        <section style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Seus Registros de Prova</h3>
            <button
              onClick={fetchRecords}
              style={{ backgroundColor: 'transparent', color: '#38bdf8', border: 'none', fontSize: '0.8rem', textDecoration: 'underline' }}
            >
              Atualizar
            </button>
          </div>

          {records.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              Nenhum registro probatório encontrado. Realize sua primeira captura acima!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {records.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => handleViewDetails(rec.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    backgroundColor: selectedRecord?.record.id === rec.id ? '#334155' : '#0f172a',
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: rec.status === 'COMPLETED' ? '#065f46' : rec.status === 'FAILED' ? '#991b1b' : '#854d0e',
                      color: rec.status === 'COMPLETED' ? '#6ee7b7' : rec.status === 'FAILED' ? '#fca5a5' : '#fde047'
                    }}>
                      {rec.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(rec.createdAt).toLocaleDateString('pt-BR')} {new Date(rec.createdAt).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#e2e8f0', wordBreak: 'break-all', fontWeight: 500 }}>
                    {rec.targetUrl}
                  </div>
                  {rec.sha256Hash && (
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem', fontFamily: 'monospace' }}>
                      Hash: {rec.sha256Hash.substring(0, 16)}...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* REQ 13: Detalhes do Registro Selecionado com Validação de Integridade */}
        {selectedRecord && (
          <section style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Detalhes da Evidência Probatória</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{ backgroundColor: 'transparent', color: '#94a3b8', border: 'none', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            {loadingDetails ? (
              <p style={{ color: '#94a3b8' }}>Carregando dados probatórios...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Badge de Integridade Criptográfica (ADR 7) */}
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: selectedRecord.isIntegrityValid ? '#064e3b' : '#7f1d1d',
                  border: `1px solid ${selectedRecord.isIntegrityValid ? '#059669' : '#dc2626'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{selectedRecord.isIntegrityValid ? '✅' : '❌'}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: '#fff' }}>
                      {selectedRecord.isIntegrityValid ? 'Integridade Validada com Sucesso' : 'Alerta de Inconsistência de Integridade'}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                      {selectedRecord.isIntegrityValid
                        ? 'O arquivo armazenado confere perfeitamente com o Hash SHA-256 gerado no momento da captura.'
                        : 'O hash recalculado não corresponde ao registro original.'}
                    </span>
                  </div>
                </div>

                {/* Metadados da Coleta */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>ID da Evidência:</span>
                    <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{selectedRecord.record.id}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>IP do Servidor Remoto:</span>
                    <span style={{ fontFamily: 'monospace', color: '#cbd5e1' }}>{selectedRecord.record.serverIp || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Data/Hora da Coleta (UTC):</span>
                    <span style={{ color: '#cbd5e1' }}>
                      {selectedRecord.record.capturedAt ? new Date(selectedRecord.record.capturedAt).toUTCString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Tipo de Prova:</span>
                    <span style={{ color: '#cbd5e1' }}>Captura de Tela (Full Page PNG)</span>
                  </div>
                </div>

                {/* Hash Criptográfico Completo (ADR 7) */}
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                    Hash SHA-256 da Evidência (Cadeia de Custódia):
                  </span>
                  <div style={{
                    padding: '0.6rem',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                    color: '#38bdf8'
                  }}>
                    {selectedRecord.record.sha256Hash || 'Nenhum hash gerado'}
                  </div>
                </div>

                {/* Visualização da Captura */}
                {selectedRecord.record.status === 'COMPLETED' && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                      Pré-visualização da Tela Capturada:
                    </span>
                    <div style={{
                      maxHeight: '350px',
                      overflowY: 'auto',
                      borderRadius: '8px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a'
                    }}>
                      <img
                        src={`http://localhost:8000/api/records/${selectedRecord.record.id}/file`}
                        alt="Evidência Capturada"
                        style={{ width: '100%', display: 'block' }}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

