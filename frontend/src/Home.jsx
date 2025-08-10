import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to PC-Forge</h1>
        <p className="home-subtitle">
          Your personal PC building assistant. Create and save your custom builds with guaranteed compatibility.
        </p>
        <div className="home-buttons">
          <Link to="/builder" className="save-button">
            Start a New Build
          </Link>
          <Link to="/builds" className="save-button" style={{ backgroundColor: '#374151' }}>
            View Saved Builds
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;