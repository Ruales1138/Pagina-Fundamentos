import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: pedir email, 2: ingresar código
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (data.ok && data.code) {
        setGeneratedCode(data.code);
        setSuccess(`Código generado: ${data.code} (válido por 15 minutos)`);
        setStep(2);
      } else {
        setError(data.message || 'Error al generar código');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code, newPassword }),
      });

      const data = await response.json();

      if (data.ok) {
        setSuccess('¡Contraseña actualizada! Redirigiendo al login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Error al resetear contraseña');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🔐 Recuperar Contraseña</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestCode} className={styles.form}>
            <p className={styles.instructions}>
              Ingresa tu correo/usuario para recibir un código de recuperación
            </p>
            
            <div className={styles.inputGroup}>
              <label>Email/Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu.correo@udem.edu.co o Usuario"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Generando...' : 'Solicitar Código'}
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => navigate('/login')}
            >
              Volver al Login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.codeDisplay}>
              <p>📱 Tu código de verificación es:</p>
              <div className={styles.code}>{generatedCode}</div>
              <small>(En producción, este código se enviaría por email)</small>
            </div>

            <div className={styles.inputGroup}>
              <label>Código de Verificación</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength="6"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setStep(1);
                setCode('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
                setSuccess('');
              }}
            >
              Solicitar Nuevo Código
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
