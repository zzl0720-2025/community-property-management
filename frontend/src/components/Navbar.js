import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Navbar — simple top navigation bar.
 * Shows login/register when logged out, dashboard + logout when logged in.
 */
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Community Management</span>
      <div>
        {token ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a1a2e', color: '#fff' },
  brand:  { fontWeight: 'bold', fontSize: '1.1rem' },
  link:   { color: '#fff', marginLeft: '16px', textDecoration: 'none' },
  button: { marginLeft: '16px', background: 'transparent', border: '1px solid #fff', color: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: '4px' },
};

export default Navbar;
