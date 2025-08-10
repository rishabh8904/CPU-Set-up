import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Import the stylesheet

function SavedBuilds() {
  const [builds, setBuilds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Use the environment variable for the API URL
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/api/builds`)
      .then(response => {
        setBuilds(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching builds:", err);
        setError('Could not fetch saved builds.');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError('');
    axios.get(`${API_URL}/api/builds/search/${searchTerm.trim()}`)
      .then(response => {
        setSearchResults([response.data]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error searching build:", err);
        setError(`No build found with UID: ${searchTerm}`);
        setSearchResults([]);
        setLoading(false);
      });
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
    setError('');
  }
  
  const handleDelete = async (buildIdToDelete) => {
    if (window.confirm('Are you sure you want to permanently delete this build?')) {
      try {
        await axios.delete(`${API_URL}/api/builds/${buildIdToDelete}`);
        setBuilds(currentBuilds => currentBuilds.filter(build => build._id !== buildIdToDelete));
        if (searchResults) {
          setSearchResults(currentResults => currentResults.filter(build => build._id !== buildIdToDelete));
        }
      } catch (err) {
        console.error("Error deleting build:", err);
        alert("There was an error deleting the build. Please try again.");
      }
    }
  };

  const buildsToDisplay = searchResults !== null ? searchResults : builds;

  const componentOrder = [
    { key: 'cpu', label: 'CPU' }, { key: 'motherboard', label: 'Motherboard' },
    { key: 'cooler', label: 'Cooler' }, { key: 'ram', label: 'RAM' },
    { key: 'gpu', label: 'GPU' }, { key: 'storage', label: 'Storage' },
    { key: 'psu', label: 'PSU' }, { key: 'pcCase', label: 'Case' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Saved Builds</h1>
        <Link to="/" style={styles.backLink}>&larr; Back to Home</Link>
      </div>

      <form onSubmit={handleSearch} style={styles.searchContainer}>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by UID (e.g., 12345678)" style={styles.searchInput}/>
        <button type="submit" style={styles.searchButton}>Search</button>
        {searchResults !== null && <button type="button" onClick={clearSearch} style={styles.clearButton}>Clear</button>}
      </form>

      {loading && <p>Loading builds...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!loading && buildsToDisplay.length === 0 && <p>No saved builds found.</p>}

      <div style={styles.grid}>
        {buildsToDisplay.map(build => (
          <div key={build._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>{build.buildName}</h2>
              <button onClick={() => handleDelete(build._id)} style={styles.deleteButton}>&times;</button>
            </div>
            <p style={styles.cardUid}>UID: {build.uid}</p>
            <ul style={styles.componentList}>
              {componentOrder.map(section => {
                const component = build.components[section.key];
                return component ? <li key={section.key}><strong>{section.label}:</strong> {component.name}</li> : null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', color: 'white', backgroundColor: '#111827', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  backLink: { color: '#22d3ee', textDecoration: 'none' },
  searchContainer: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  searchInput: { flexGrow: 1, padding: '0.75rem', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '0.375rem', color: 'white' },
  searchButton: { padding: '0.75rem 1.5rem', backgroundColor: '#06b6d4', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
  clearButton: { padding: '0.75rem 1.5rem', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' },
  grid: { display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' },
  card: { backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #374151', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '-0.5rem' },
  cardTitle: { marginTop: 0, color: '#22d3ee', flexGrow: 1, paddingRight: '1rem' },
  cardUid: { fontSize: '0.875rem', color: '#9ca3af', marginTop: '-0.5rem', marginBottom: '1rem' },
  componentList: { listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' },
  deleteButton: { 
    background: 'none', border: 'none', color: '#6b7280', fontSize: '1.5rem', 
    cursor: 'pointer', padding: '0 0.5rem', lineHeight: '1',
    transition: 'color 0.2s',
  },
};

export default SavedBuilds;