import React, { useState } from 'react';
import { apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/identity/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '4rem',
        alignItems: 'start'
      }}>
        {/* Coluna da Esquerda (Editorial) */}
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
            PROVA DIGITAL DE PÁGINAS DA INTERNET
          </span>

          <h1 style={{
            fontSize: '3.25rem',
            lineHeight: 1.15,
            fontWeight: 400,
            color: '#000000',
            marginBottom: '3rem'
          }}>
            Toda prova começa com um <span style={{ color: '#991b1b', fontStyle: 'italic', fontWeight: 600 }}>registro.</span>
          </h1>

          <div style={{ borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem 0', borderBottom: '1px solid #e5e7eb', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.2rem', fontFamily: 'serif', color: '#111827', minWidth: '30px' }}>01</span>
              <span style={{ fontSize: '0.95rem', color: '#374151' }}>Cole o endereço da página que deseja preservar.</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem 0', borderBottom: '1px solid #e5e7eb', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.2rem', fontFamily: 'serif', color: '#111827', minWidth: '30px' }}>02</span>
              <span style={{ fontSize: '0.95rem', color: '#374151' }}>Escolha captura de tela ou vídeo de navegação.</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem 0', borderBottom: '1px solid #e5e7eb', alignItems: 'baseline' }}>
              <span style={{ fontSize: '1.2rem', fontFamily: 'serif', color: '#111827', minWidth: '30px' }}>03</span>
              <span style={{ fontSize: '0.95rem', color: '#374151' }}>Receba relatório com hash e data, pronto para anexar.</span>
            </div>
          </div>
        </div>

        {/* Coluna da Direita (Formulário Estilo Tela 1 do Figma) */}
        <div style={{
          borderLeft: '1px solid #111827',
          paddingLeft: '3.5rem',
          paddingTop: '0.5rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '2rem', color: '#000' }}>
            Entrar
          </h2>

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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem', color: '#111827', textTransform: 'uppercase' }}>
                E-MAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0',
                  border: 'none',
                  borderBottom: '1px solid #111827',
                  backgroundColor: 'transparent',
                  color: '#000000',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="seu.email@exemplo.com.br"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem', color: '#111827', textTransform: 'uppercase' }}>
                SENHA
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0',
                  border: 'none',
                  borderBottom: '1px solid #111827',
                  backgroundColor: 'transparent',
                  color: '#000000',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="••••••••••••"
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
                transition: 'opacity 0.2s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'AUTENTICANDO...' : 'ENTRAR →'}
            </button>
          </form>

          <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>
            Acesso restrito a usuários cadastrados. Seus registros só ficam visíveis para você.
          </p>
        </div>
      </div>
    </div>
  );
};
