import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Auth() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        alert('Revisa tu correo para confirmar tu cuenta.');
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container auth-container">
      <div className="auth-header">
        <div className="auth-logo flex-center">
          <span className="material-symbols-outlined" style={{fontSize: '64px'}}>account_balance_wallet</span>
        </div>
        <h1 className="text-h1">Control de Gastos</h1>
        <p className="text-muted">Tus finanzas bajo control, siempre.</p>
      </div>

      <div className="auth-tabs">
        <button 
          className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
          onClick={() => setMode('signin')}
        >
          Entrar
        </button>
        <button 
          className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
          onClick={() => setMode('signup')}
        >
          Crear Cuenta
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        
        <div className="auth-input-group">
          <span className="material-symbols-outlined">mail</span>
          <input 
            type="email" 
            className="auth-input" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-input-group">
          <span className="material-symbols-outlined">lock</span>
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{marginTop: '16px'}}>
          {loading ? 'Cargando...' : mode === 'signin' ? 'Iniciar Sesión' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
}
