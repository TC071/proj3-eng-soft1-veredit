import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main style={{ flex: 1 }}>
        {isAuthenticated ? (
          <DashboardPage />
        ) : currentView === 'login' ? (
          <LoginPage
            onSuccess={() => {}}
            onNavigateToRegister={() => setCurrentView('register')}
          />
        ) : (
          <RegisterPage
            onSuccess={() => setCurrentView('login')}
            onNavigateToLogin={() => setCurrentView('login')}
          />
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid #1e293b',
        color: '#64748b',
        fontSize: '0.8rem'
      }}>
        Veridit — Engenharia de Software I (2026.2) · UFBA · Sistema de Provas Digitais na Web
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

