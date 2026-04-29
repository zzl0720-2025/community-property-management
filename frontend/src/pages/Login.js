import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

/**
 * Login page — calls POST /api/auth/login, stores JWT in localStorage.
 */
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input name="email"    type="email"    placeholder="Email"    value={form.email}    onChange={handleChange} style={styles.input} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} required />
        <button type="submit" style={styles.button}>Login</button>
        <p>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '80px' },
  form:      { display: 'flex', flexDirection: 'column', gap: '12px', width: '320px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: '8px' },
  input:     { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
  button:    { padding: '10px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  error:     { color: 'red', fontSize: '0.9rem' },
};

export default Login;
