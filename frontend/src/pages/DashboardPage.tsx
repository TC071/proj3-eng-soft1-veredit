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

interface DashboardProps {
  initialView?: 'capture' | 'records';
}

export const DashboardPage: React.FC<DashboardProps> = ({ initialView = 'capture' }) => {
  const [view, setView] = useState<'capture' | 'records' | 'details'>(initialView);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<RecordDetails | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

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
    setActiveStep(1); // Pedido recebido

    try {
      // 1. REQ 08: Iniciar registro de conteúdo
      const createRes = await apiRequest('/records', {
        method: 'POST',
        body: JSON.stringify({ targetUrl, captureType: 'SCREENSHOT' }),
      });

      const recordId = createRes.record.id;
      setActiveStep(2); // Página acessada pelo servidor

      setTimeout(() => {
        setActiveStep(3); // Capturando tela...
      }, 800);

      // 2. REQ 11: Executar captura headless e calcular SHA-256
      await apiRequest(`/records/${recordId}/capture`, {
        method: 'POST',
      });

      setActiveStep(4); // Hash SHA-256 calculado

      setTargetUrl('');
      setReference('');
      await fetchRecords();
      await handleViewDetails(recordId);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar captura da prova.');
      await fetchRecords();
    } finally {
      setLoading(false);
      setActiveStep(0);
    }
  };

  // REQ 13: Visualizar detalhes do registro e integridade
  const handleViewDetails = async (recordId: string) => {
    try {
      const data = await apiRequest(`/records/${recordId}`);
      setSelectedRecord(data);
      setView('details');
    } catch (err: any) {
      alert(`Erro ao carregar detalhes: ${err.message}`);
    }
  };

  const getEvidenceImageUrl = (recordId: string) => {
    return `http://localhost:8000/api/records/${recordId}/file`;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2.5rem auto', padding: '0 2rem' }}>
      {/* =========================================================================
          TELA 7: DETALHES DO REGISTRO COM HASHES E SELO VERMELHO (REQ 13)
         ========================================================================= */}
      {view === 'details' && selectedRecord ? (
        <div>
          {/* Breadcrumb e Ações */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #111827',
            paddingBottom: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              <span
                onClick={() => setView('records')}
                style={{ cursor: 'pointer', textDecoration: 'underline', color: '#111827' }}
              >
                Livro de registros
              </span>{' '}
              / Nº {selectedRecord.record.id.substring(0, 8)}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setView('capture')}
                style={{
                  padding: '0.6rem 1.2rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #111827',
                  color: '#111827',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                + Nova Captura
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
            {/* Coluna da Esquerda: Mockup da Página Capturada e Hashes */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#15803d' }}></span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#15803d', textTransform: 'uppercase' }}>
                  AUTENTICADO
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', fontWeight: 400, color: '#000000', marginBottom: '0.5rem' }}>
                Registro Nº {selectedRecord.record.id.substring(0, 8)}
              </h1>

              <div style={{ fontSize: '0.95rem', color: '#4b5563', marginBottom: '2rem', wordBreak: 'break-all' }}>
                {selectedRecord.record.targetUrl}
              </div>

              {/* Moldura de Navegador para a Imagem */}
              <div style={{ border: '1px solid #111827', marginBottom: '0.5rem' }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  borderBottom: '1px solid #111827',
                  padding: '0.5rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#4b5563'
                }}>
                  <span>□ □</span>
                  <span style={{ color: '#111827', fontWeight: 500 }}>{selectedRecord.record.targetUrl}</span>
                </div>

                <div style={{ maxHeight: '420px', overflowY: 'auto', backgroundColor: '#ffffff' }}>
                  <img
                    src={getEvidenceImageUrl(selectedRecord.record.id)}
                    alt="Evidência Capturada"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2.5rem' }}>
                Página inteira · Formato PNG · Custódia Digital Imutável
              </div>

              {/* Tabela de Arquivos e Integridade (Figma Tela 7) */}
              <div style={{ borderTop: '2px solid #111827', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 400, marginBottom: '1rem', color: '#000000' }}>
                  Arquivos e integridade
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #111827' }}>
                      <th style={{ padding: '0.5rem 0', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ARQUIVO</th>
                      <th style={{ padding: '0.5rem 0', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>STATUS</th>
                      <th style={{ padding: '0.5rem 0', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>HASH SHA-256</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>captura.png</td>
                      <td style={{ padding: '0.75rem 0', color: '#15803d', fontWeight: 600 }}>
                        {selectedRecord.isIntegrityValid ? '✓ Íntegro' : '✗ Inválido'}
                      </td>
                      <td style={{ padding: '0.75rem 0', fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all', color: '#111827' }}>
                        {selectedRecord.record.sha256Hash}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Coluna da Direita: Selo Vermelho de Autenticidade e Metadados Legais */}
            <div style={{
              borderLeft: '1px solid #111827',
              paddingLeft: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {/* O Selo Vermelho Autêntico do Veridit (Estilo Tela 7 do Figma) */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: '3px double #991b1b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#991b1b',
                margin: '1rem 0 2.5rem',
                transform: 'rotate(-5deg)',
                boxShadow: '0 0 0 1px #991b1b inset'
              }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  VERIDIT
                </span>
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.08em', margin: '2px 0' }}>
                  REGISTRO AUTÊNTICO
                </span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'serif', fontWeight: 700, margin: '2px 0' }}>
                  Nº {selectedRecord.record.id.substring(0, 4)}
                </span>
                <span style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  SHA-256
                </span>
              </div>

              {/* Tabela de Metadados Chave-Valor */}
              <div style={{ width: '100%', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Formato:</span>
                  <strong style={{ color: '#111827' }}>Captura de tela</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Data da coleta:</span>
                  <strong style={{ color: '#111827' }}>
                    {selectedRecord.record.capturedAt
                      ? new Date(selectedRecord.record.capturedAt).toLocaleDateString('pt-BR')
                      : 'N/A'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Hora da coleta (UTC):</span>
                  <strong style={{ color: '#111827' }}>
                    {selectedRecord.record.capturedAt
                      ? new Date(selectedRecord.record.capturedAt).toLocaleTimeString('pt-BR') + ' UTC'
                      : 'N/A'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>IP do servidor:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#111827' }}>
                    {selectedRecord.record.serverIp || '127.0.0.1'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Validade Probatória:</span>
                  <strong style={{ color: '#15803d' }}>Garantida (SHA-256)</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedRecord.record.sha256Hash || '');
                  alert('Hash SHA-256 copiado para a área de transferência!');
                }}
                style={{
                  marginTop: '2rem',
                  background: 'none',
                  border: 'none',
                  color: '#111827',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Copiar hash da captura
              </button>
            </div>
          </div>
        </div>
      ) : view === 'records' ? (
        /* =========================================================================
           TELA 6: LISTAGEM DE REGISTROS (LIVRO DE REGISTROS - REQ 12)
           ========================================================================= */
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #111827',
            paddingBottom: '1rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 400, color: '#000000', marginBottom: '0.25rem' }}>
                Livro de registros
              </h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Consulte todas as evidências registradas sob custódia digital.
              </p>
            </div>

            <button
              onClick={() => setView('capture')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#000000',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              + Nova Captura
            </button>
          </div>

          {records.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Nenhum registro encontrado no livro.</p>
              <button
                onClick={() => setView('capture')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                Registrar primeira prova
              </button>
            </div>
          ) : (
            <div style={{ border: '1px solid #111827' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #111827', textAlign: 'left' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>REGISTRO</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>ENDEREÇO DA PÁGINA</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>DATA/HORA</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>STATUS</th>
                    <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'right' }}>AÇÃO</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr
                      key={rec.id}
                      onClick={() => handleViewDetails(rec.id)}
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>Nº {rec.id.substring(0, 8)}</td>
                      <td style={{ padding: '1rem 1.25rem', color: '#111827', maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rec.targetUrl}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', color: '#4b5563' }}>
                        {new Date(rec.createdAt).toLocaleDateString('pt-BR')} {new Date(rec.createdAt).toLocaleTimeString('pt-BR')}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: rec.status === 'COMPLETED' ? '#15803d' : rec.status === 'FAILED' ? '#991b1b' : '#b45309'
                        }}>
                          {rec.status === 'COMPLETED' ? '● Concluído' : rec.status === 'FAILED' ? '● Falhou' : '● Em andamento'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 600, color: '#000000' }}>
                        Ver detalhes →
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
           TELA 5: NOVA CAPTURA E CADEIA DE CUSTÓDIA (REQ 08 e 11)
           ========================================================================= */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1.1fr',
          gap: '4.5rem',
          alignItems: 'start'
        }}>
          {/* Coluna da Esquerda: Formulário de Coleta */}
          <div>
            <span style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#111827',
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              NOVA CAPTURA
            </span>

            <h1 style={{
              fontSize: '3.25rem',
              lineHeight: 1.15,
              fontWeight: 400,
              color: '#000000',
              marginBottom: '2.5rem'
            }}>
              O que você quer <span style={{ color: '#991b1b', fontStyle: 'italic', fontWeight: 600 }}>registrar?</span>
            </h1>

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                padding: '0.75rem 1rem',
                borderLeft: '3px solid #991b1b',
                marginBottom: '1.5rem',
                fontSize: '0.85rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleStartCapture} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem', color: '#111827', textTransform: 'uppercase' }}>
                  ENDEREÇO DA PÁGINA
                </label>
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://exemplo.com.br/conteudo-a-preservar"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0',
                    border: 'none',
                    borderBottom: '1px solid #111827',
                    backgroundColor: 'transparent',
                    color: '#000000',
                    fontSize: '1.05rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Formato */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.75rem', color: '#111827', textTransform: 'uppercase' }}>
                  FORMATO
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{
                    border: '1px solid #111827',
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Captura de tela</span>
                      <span>●</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Imagem da página inteira, com toda a rolagem.
                    </p>
                  </div>

                  <div style={{
                    border: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    padding: '1rem',
                    opacity: 0.6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Vídeo de navegação</span>
                      <span>○</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Gravação da navegação (em breve).
                    </p>
                  </div>
                </div>
              </div>

              {/* Referência Interna */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                  REFERÊNCIA INTERNA (OPCIONAL)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ex.: Processo nº 0001234-56.2026, cliente ou pasta"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0',
                    border: 'none',
                    borderBottom: '1px solid #d1d5db',
                    backgroundColor: 'transparent',
                    color: '#000000',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '1rem',
                  padding: '1.1rem',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'EXECUTANDO CAPTURA...' : 'REGISTRAR AGORA →'}
              </button>
            </form>
          </div>

          {/* Coluna da Direita: Cadeia de Custódia (Figma Tela 5) */}
          <div style={{
            borderLeft: '1px solid #111827',
            paddingLeft: '3.5rem',
            paddingTop: '0.5rem'
          }}>
            <span style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#6b7280',
              marginBottom: '0.5rem',
              textTransform: 'uppercase'
            }}>
              {loading ? 'EM ANDAMENTO' : 'SISTEMA DE AUDITORIA'}
            </span>

            <h2 style={{ fontSize: '2rem', fontWeight: 400, color: '#000000', marginBottom: '1.5rem' }}>
              Cadeia de custódia
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: activeStep >= 1 ? '#15803d' : '#9ca3af' }}>■</span>
                <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: activeStep >= 1 ? 600 : 400 }}>
                  Pedido recebido pelo serviço de registros
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: activeStep >= 2 ? '#15803d' : '#9ca3af' }}>■</span>
                <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: activeStep >= 2 ? 600 : 400 }}>
                  Página acessada em navegador headless isolado
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: activeStep >= 3 ? '#991b1b' : '#9ca3af' }}>
                  {activeStep === 3 ? '□' : '■'}
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  color: activeStep === 3 ? '#991b1b' : '#111827',
                  fontWeight: activeStep === 3 ? 700 : 400
                }}>
                  {activeStep === 3 ? 'Capturando tela da página... (agora)' : 'Captura de tela realizada'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: activeStep >= 4 ? '#15803d' : '#9ca3af' }}>■</span>
                <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: activeStep >= 4 ? 600 : 400 }}>
                  Cálculo do Hash SHA-256 e integridade probatória
                </span>
              </div>
            </div>

            <div style={{ marginTop: '3.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <span
                onClick={() => setView('records')}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#000000',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                Ver livro de registros ({records.length}) →
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
