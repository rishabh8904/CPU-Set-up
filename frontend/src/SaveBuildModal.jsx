import React, { useState } from 'react';

function SaveBuildModal({ isOpen, onClose, onSave }) {
  const [buildName, setBuildName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (buildName.trim()) {
      onSave(buildName);
      setBuildName(''); 
    } else {
      alert('Please enter a name for your build.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Save Your Build</h2>
        <p>Give your new PC build a name to remember it by.</p>
        <input
          type="text"
          value={buildName}
          onChange={(e) => setBuildName(e.target.value)}
          placeholder="e.g., My Ultimate Gaming Rig"
          style={styles.input}
        />
        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={{...styles.button, ...styles.secondaryButton}}>Cancel</button>
          <button onClick={handleSave} style={styles.button}>Save</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1f2937', padding: '2rem', borderRadius: '0.5rem',
    color: 'white', width: '90%', maxWidth: '500px', textAlign: 'center',
  },
  input: {
    width: '100%', padding: '0.75rem', margin: '1rem 0', borderRadius: '0.375rem',
    border: '1px solid #4b5563', backgroundColor: '#374151', color: 'white',
  },
  buttonContainer: { display: 'flex', gap: '1rem', justifyContent: 'flex-end' },
  button: {
    padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none',
    fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#06b6d4', color: 'white'
  },
  secondaryButton: { backgroundColor: '#4b5563' }
};

export default SaveBuildModal;