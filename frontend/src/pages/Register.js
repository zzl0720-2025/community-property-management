import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/api';

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await registerApi(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          name="fullName" type="text" placeholder="Full Name"
          value={form.fullName} onChange={handleChange} style={styles.input} required
        />
        <input
          name="email" type="email" placeholder="Email"
          value={form.email} onChange={handleChange} style={styles.input} required
        />
        <input
          name="password" type="password" placeholder="Password (min 6 chars)"
          value={form.password} onChange={handleChange} style={styles.input} required minLength={6}
        />
        <input
          name="phone" type="tel" placeholder="Phone (optional)"
          value={form.phone} onChange={handleChange} style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '60px' },
  form:      { display: 'flex', flexDirection: 'column', gap: '12px', width: '320px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', borderRadius: '8px' },
  input:     { padding: '10px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' },
  button:    { padding: '10px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' },
  error:     { color: 'red', fontSize: '0.9rem' },
};

export default Register;
