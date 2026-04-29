import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../services/api';

/**
 * Dashboard page — shows the latest community announcements.
 * Fetches from GET /api/announcements on mount.
 */
function Dashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnnouncements()
      .then(({ data }) => setAnnouncements(data))
      .catch(() => setError('Failed to load announcements'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.center}>Loading...</p>;
  if (error)   return <p style={{ ...styles.center, color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2>Community Dashboard</h2>
      <p style={styles.subtitle}>Latest Announcements</p>

      {announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div key={a.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{a.title}</h3>
            <p style={styles.cardBody}>{a.content}</p>
            <small style={styles.meta}>
              Posted by {a.postedBy?.fullName} &bull; {new Date(a.postedAt).toLocaleDateString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 16px' },
  subtitle:  { color: '#666', marginBottom: '24px' },
  card:      { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cardTitle: { margin: '0 0 8px', fontSize: '1.1rem' },
  cardBody:  { margin: '0 0 12px', color: '#333' },
  meta:      { color: '#999', fontSize: '0.85rem' },
  center:    { textAlign: 'center', marginTop: '60px' },
};

export default Dashboard;
