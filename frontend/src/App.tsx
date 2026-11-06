import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'capture' | 'records'>('login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {isAuthenticated ? (
          <DashboardPage initialView={currentView === 'records' ? 'records' : 'capture'} key={currentView} />
        ) : currentView === 'login' ? (
          <LoginPage
            onSuccess={() => setCurrentView('capture')}
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
        padding: '2rem',
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '0.75rem',
        backgroundColor: '#ffffff'
      }}>
        © Veridit — Sistema de Registro de Provas Digitais na Web · Engenharia de Software I (2026.2) · UFBA
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
