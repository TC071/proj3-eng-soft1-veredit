import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: 'login' | 'register' | 'capture' | 'records';
  setCurrentView: (view: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={{ borderBottom: '1px solid #111827', backgroundColor: '#ffffff' }}>
      {/* Barra Superior Principal */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logotipo Veridit em Serifa */}
        <div
          onClick={() => isAuthenticated && setCurrentView('capture')}
          style={{ cursor: isAuthenticated ? 'pointer' : 'default' }}
        >
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#000000',
            textTransform: 'uppercase'
          }}>
            VERIDIT
          </span>
        </div>

        {/* Navegação */}
        {isAuthenticated ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span
              onClick={() => setCurrentView('capture')}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                paddingBottom: '0.25rem',
                borderBottom: currentView === 'capture' ? '2px solid #000000' : 'none',
                color: currentView === 'capture' ? '#000000' : '#6b7280'
              }}
            >
              Capturar
            </span>

            <span
              onClick={() => setCurrentView('records')}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                paddingBottom: '0.25rem',
                borderBottom: currentView === 'records' ? '2px solid #000000' : 'none',
                color: currentView === 'records' ? '#000000' : '#6b7280'
              }}
            >
              Registros
            </span>

            <button
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#991b1b',
                cursor: 'pointer',
                marginLeft: '1rem'
              }}
            >
              Sair →
            </button>
          </nav>
        ) : (
          <div>
            {currentView === 'login' ? (
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Ainda não tem conta?{' '}
                <strong
                  onClick={() => setCurrentView('register')}
                  style={{ color: '#000000', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Criar conta →
                </strong>
              </span>
            ) : (
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Já tem conta?{' '}
                <strong
                  onClick={() => setCurrentView('login')}
                  style={{ color: '#000000', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Entrar →
                </strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Sub-barra de Status do Usuário (Conforme Tela 5 do Figma) */}
      {isAuthenticated && (
        <div style={{
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          fontSize: '0.75rem',
          color: '#4b5563'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              Saldo: <strong style={{ color: '#000000' }}>12 créditos</strong>
            </div>
            <div>
              {user?.role === 'lawyer' ? 'Dr(a). ' : ''}
              <strong style={{ color: '#000000' }}>{user?.name}</strong> ·{' '}
              {user?.role === 'lawyer' ? 'Advogado' : 'Cidadão'}
              {user?.role === 'lawyer' && ' · OAB Autenticada'}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
