import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff'
        }}>V</div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
          Veridit <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8' }}>Provas Digitais</span>
        </h1>
      </div>

      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
              Olá, <strong>{user?.name}</strong> ({user?.role === 'lawyer' ? 'Advogado' : 'Cidadão'})
            </span>
            <button
              onClick={logout}
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'background 0.2s'
              }}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentView('login')}
              style={{
                backgroundColor: currentView === 'login' ? '#334155' : 'transparent',
                color: '#fff',
                border: '1px solid #475569',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem'
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => setCurrentView('register')}
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              Cadastre-se
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

