import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>Community Management</span>
      <div style={styles.right}>
        {isAuthenticated ? (
          <>
            {user?.fullName && <span style={styles.name}>{user.fullName}</span>}
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
  right:  { display: 'flex', alignItems: 'center', gap: '8px' },
  name:   { color: '#ccc', fontSize: '0.9rem' },
  link:   { color: '#fff', marginLeft: '8px', textDecoration: 'none' },
  button: { marginLeft: '8px', background: 'transparent', border: '1px solid #fff', color: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: '4px' },
};

export default Navbar;
