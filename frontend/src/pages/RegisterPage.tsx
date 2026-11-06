import React, { useState } from 'react';
import { apiRequest } from '../services/api';

interface RegisterPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [role, setRole] = useState<'common' | 'lawyer'>('common');
  const [oab, setOab] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await apiRequest('/identity/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          cpf,
          role,
          oab: role === 'lawyer' ? oab : undefined,
        }),
      });

      setSuccessMsg('Cadastro realizado com sucesso! Redirecionando...');
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
    <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '2rem', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Criar Conta no Veridit</h2>

      {error && (
        <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{ backgroundColor: '#14532d', color: '#86efac', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Nome Completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff' }}
            placeholder="Dr(a). Maria Silva"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff' }}
            placeholder="maria@advocacia.com"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>CPF</label>
            <input
              type="text"
              required
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff' }}
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Perfil</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff' }}
            >
              <option value="common">Usuário Comum</option>
              <option value="lawyer">Advogado</option>
            </select>
          </div>
        </div>

        {role === 'lawyer' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Número OAB (com UF)</label>
            <input
              type="text"
              required
              value={oab}
              onChange={(e) => setOab(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff' }}
              placeholder="OAB/BA 123456"
            />
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: '#cbd5e1' }}>Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #475569', color: '#fff' }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: '0.5rem', padding: '0.75rem', borderRadius: '6px', backgroundColor: '#2563eb', color: '#fff', border: 'none', fontWeight: 600 }}
        >
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#94a3b8' }}>
        Já possui conta?{' '}
        <span onClick={onNavigateToLogin} style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }}>
          Faça login
        </span>
      </p>
    </div>
  );
};

