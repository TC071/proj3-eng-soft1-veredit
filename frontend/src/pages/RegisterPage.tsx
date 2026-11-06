import React, { useState } from 'react';
import { apiRequest } from '../services/api';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess }) => {
  const [role, setRole] = useState<'lawyer' | 'common'>('lawyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [oab, setOab] = useState('');
  const [oabUf, setOabUf] = useState('BA');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const fullOab = role === 'lawyer' ? `${oab}/${oabUf}` : undefined;

      await apiRequest('/identity/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          cpf,
          role,
          oab: fullOab,
        }),
      });

      setSuccessMsg('Conta criada com sucesso! Redirecionando para login...');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '3.5rem auto', padding: '0 2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.4fr',
        gap: '4rem',
        alignItems: 'start'
      }}>
        {/* Coluna da Esquerda */}
        <div>
          <span style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#111827',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
          }}>
            NOVO CADASTRO
          </span>

          <h1 style={{
            fontSize: '3.25rem',
            lineHeight: 1.15,
            fontWeight: 400,
            color: '#000000',
            marginBottom: '1.5rem'
          }}>
            Abra sua conta no Veridit.
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#4b5563', lineHeight: 1.6, maxWidth: '360px' }}>
            Depois do cadastro, sua conta estará autorizada para autenticar e registrar provas digitais de páginas da web com fé probatória.
          </p>
        </div>

        {/* Coluna da Direita (Formulário Estilo Tela 2 do Figma) */}
        <div style={{
          borderLeft: '1px solid #111827',
          paddingLeft: '3.5rem'
        }}>
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

          {successMsg && (
            <div style={{
              backgroundColor: '#dcfce7',
              color: '#15803d',
              padding: '0.75rem 1rem',
              borderLeft: '3px solid #15803d',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Tipo de Conta */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.75rem', color: '#111827', textTransform: 'uppercase' }}>
                TIPO DE CONTA
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  onClick={() => setRole('lawyer')}
                  style={{
                    border: '1px solid #111827',
                    padding: '0.85rem',
                    backgroundColor: role === 'lawyer' ? '#111827' : '#ffffff',
                    color: role === 'lawyer' ? '#ffffff' : '#111827',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    {role === 'lawyer' ? '● ' : '○ '}Advogado
                  </div>
                  <div style={{ fontSize: '0.7rem', color: role === 'lawyer' ? '#9ca3af' : '#6b7280' }}>
                    Inclui número da OAB no relatório.
                  </div>
                </div>

                <div
                  onClick={() => setRole('common')}
                  style={{
                    border: '1px solid #111827',
                    padding: '0.85rem',
                    backgroundColor: role === 'common' ? '#111827' : '#ffffff',
                    color: role === 'common' ? '#ffffff' : '#111827',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                    {role === 'common' ? '● ' : '○ '}Usuário comum
                  </div>
                  <div style={{ fontSize: '0.7rem', color: role === 'common' ? '#9ca3af' : '#6b7280' }}>
                    Pessoa física.
                  </div>
                </div>
              </div>
            </div>

            {/* Nome Completo */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                NOME COMPLETO
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  border: 'none',
                  borderBottom: '1px solid #111827',
                  backgroundColor: 'transparent',
                  color: '#000',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                placeholder="Dr(a). Júlio Cesar Coelho"
              />
            </div>

            {/* CPF */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                CPF
              </label>
              <input
                type="text"
                required
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  border: 'none',
                  borderBottom: '1px solid #111827',
                  backgroundColor: 'transparent',
                  color: '#000',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                placeholder="000.000.000-00"
              />
            </div>

            {/* Campos OAB (Se Advogado) */}
            {role === 'lawyer' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                    NÚMERO DA OAB
                  </label>
                  <input
                    type="text"
                    required
                    value={oab}
                    onChange={(e) => setOab(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      border: 'none',
                      borderBottom: '1px solid #111827',
                      backgroundColor: 'transparent',
                      color: '#000',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                    placeholder="123456"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                    UF DA OAB
                  </label>
                  <select
                    value={oabUf}
                    onChange={(e) => setOabUf(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      border: 'none',
                      borderBottom: '1px solid #111827',
                      backgroundColor: 'transparent',
                      color: '#000',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  >
                    <option value="BA">BA</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="DF">DF</option>
                    <option value="MG">MG</option>
                  </select>
                </div>
              </div>
            )}

            {/* E-mail */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                E-MAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  border: 'none',
                  borderBottom: '1px solid #111827',
                  backgroundColor: 'transparent',
                  color: '#000',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                placeholder="voce@exemplo.com.br"
              />
            </div>

            {/* Senha */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.4rem', color: '#111827', textTransform: 'uppercase' }}>
                SENHA
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0',
                  border: 'none',
                  borderBottom: '1px solid #111827',
                  backgroundColor: 'transparent',
                  color: '#000',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                placeholder="Mínimo de 8 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '1rem',
                padding: '1rem',
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
              {loading ? 'CADASTRANDO...' : 'CRIAR CONTA →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
