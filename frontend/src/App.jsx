import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import SaveBuildModal from './SaveBuildModal.jsx';

const CheckmarkIcon = () => (
  <svg className="checkmark-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

function App() {
  const [components, setComponents] = useState({
    cpus: [], motherboards: [], rams: [], gpus: [], psus: [], storages: [], coolers: [], pcCases: []
  });
  const [selections, setSelections] = useState({
    cpu: '', motherboard: '', ram: '', gpu: '', psu: '', storage: '', cooler: '', pcCase: ''
  });
  const [loading, setLoading] = useState({
    motherboards: false, coolers: false, rams: false, psus: false
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the environment variable for the API URL
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const endpoints = ['CPU', 'GPU', 'Storage', 'Case'];
    endpoints.forEach(endpoint => {
      axios.get(`${API_URL}/api/components/${endpoint}`)
        .then(res => {
          const key = endpoint.toLowerCase() === 'case' ? 'pcCases' : endpoint.toLowerCase() + 's';
          setComponents(prev => ({ ...prev, [key]: res.data }));
        });
    });
  }, []);

  useEffect(() => {
    setComponents(prev => ({ ...prev, motherboards: [], coolers: [] }));
    if (!selections.cpu) return;
    const cpu = components.cpus.find(c => c._id === selections.cpu);
    if (!cpu) return;
    setLoading(prev => ({ ...prev, motherboards: true, coolers: true }));
    axios.get(`${API_URL}/api/components/Motherboard/compatible?socket=${cpu.specs.Socket}`)
      .then(res => setComponents(prev => ({...prev, motherboards: res.data})))
      .finally(() => setLoading(prev => ({ ...prev, motherboards: false })));
    axios.get(`${API_URL}/api/components/Cooler/compatible?socket=${cpu.specs.Socket}`)
      .then(res => setComponents(prev => ({...prev, coolers: res.data})))
      .finally(() => setLoading(prev => ({ ...prev, coolers: false })));
  }, [selections.cpu, components.cpus]);

  useEffect(() => {
    setComponents(prev => ({ ...prev, rams: [] }));
    if (!selections.motherboard) return;
    const mobo = components.motherboards.find(m => m._id === selections.motherboard);
    if (!mobo) return;
    setLoading(prev => ({...prev, rams: true}));
    axios.get(`${API_URL}/api/components/RAM/compatible?ram_type=${mobo.specs.RAM_Type}`)
      .then(res => setComponents(prev => ({...prev, rams: res.data})))
      .finally(() => setLoading(prev => ({ ...prev, rams: false })));
  }, [selections.motherboard, components.motherboards]);

  useEffect(() => {
    setComponents(prev => ({ ...prev, psus: [] }));
    if (!selections.gpu) return;
    const gpu = components.gpus.find(g => g._id === selections.gpu);
    if (!gpu || !gpu.specs.Recommended_PSU_W) return;
    setLoading(prev => ({...prev, psus: true}));
    axios.get(`${API_URL}/api/components/PSU/compatible?min_wattage=${gpu.specs.Recommended_PSU_W}`)
      .then(res => setComponents(prev => ({...prev, psus: res.data})))
      .finally(() => setLoading(prev => ({ ...prev, psus: false })));
  }, [selections.gpu, components.gpus]);
  
  useEffect(() => {
    let total = 0;
    for (const key in selections) {
      if (selections[key]) {
        const listName = key === 'pcCase' ? 'pcCases' : key + 's';
        const list = components[listName];
        const item = list?.find(i => i._id === selections[key]);
        if (item) total += item.price;
      }
    }
    setTotalPrice(total);
  }, [selections, components]);

  const handleSelection = (type, value) => {
    const updatedSelections = { ...selections, [type]: value };
    const selectionOrder = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'psu', 'storage', 'pcCase'];
    const currentIndex = selectionOrder.indexOf(type);
    for (let i = currentIndex + 1; i < selectionOrder.length; i++) {
        const keyToReset = selectionOrder[i];
        if (keyToReset !== 'cooler' || type === 'cpu') {
             if(keyToReset === 'motherboard' && type ==='cpu') {
                updatedSelections[keyToReset] = '';
             } else if (keyToReset !== 'motherboard' && keyToReset !== 'cooler') {
                updatedSelections[keyToReset] = '';
             }
        }
    }
    if (type === 'cpu') {
        updatedSelections.motherboard = '';
        updatedSelections.cooler = '';
    }
    setSelections(updatedSelections);
  };
  
  const handleSaveBuild = async (buildName) => {
    const allComponentsSelected = Object.values(selections).every(id => id && id !== '');
    if (!allComponentsSelected) {
      alert('Please select a component for every category before saving.');
      return;
    }

    const payload = {
      buildName: buildName,
      components: { ...selections, case: selections.pcCase }
    };
    delete payload.components.pcCase;

    try {
      const response = await axios.post(`${API_URL}/api/builds/add`, payload);
      alert(`${response.data.message} Your UID is: ${response.data.uid}`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving build:', error);
      alert('There was an error saving your build.');
    }
  };

  const findItemName = (list, id) => list?.find(item => item._id === id)?.name || <span>Not selected</span>;

  const componentSections = [
    { type: 'cpu', label: 'CPU' }, { type: 'motherboard', label: 'Motherboard' },
    { type: 'cooler', label: 'CPU Cooler' }, { type: 'ram', label: 'RAM' },
    { type: 'gpu', label: 'GPU' }, { type: 'psu', label: 'PSU' },
    { type: 'storage', label: 'Storage' }, { type: 'pcCase', label: 'Case' }
  ];

  return (
    <>
      <SaveBuildModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveBuild}
      />
      <div className="builder-page-wrapper">
        <div className="container">
          <div className="selectors-panel">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem'}}>
              <h1>PC-Forge</h1>
              <Link to="/builds" style={{color: '#22d3ee', textDecoration: 'none', fontWeight: 'bold'}}>View Saved Builds &rarr;</Link>
            </div>
            <p>Build Your Dream Rig, Compatibility Guaranteed.</p>
            <div>
              {componentSections.map((section, index) => {
                const isEnabled = () => {
                  if (index === 0) return true;
                  if (section.type === 'motherboard' || section.type === 'cooler') return !!selections.cpu;
                  if (section.type === 'ram') return !!selections.motherboard;
                  const prevType = componentSections[index - 1].type;
                  return !!selections[prevType];
                };
                const items = components[section.type === 'pcCase' ? 'pcCases' : section.type + 's'];
                const isLoading = loading[section.type + 's'];

                return (
                  <div key={section.type} className={`selector-card ${!isEnabled() ? 'disabled' : ''}`}>
                    <h2>{selections[section.type] && <CheckmarkIcon />}{`Step ${index + 1}: Choose your ${section.label}`}</h2>
                    <select onChange={(e) => handleSelection(section.type, e.target.value)} value={selections[section.type]} disabled={!isEnabled()}>
                      <option value="">-- Select a {section.label} --</option>
                      {isLoading ? (<option>Loading...</option>) : (
                        items && items.length > 0 ? (
                          items.map(item => <option key={item._id} value={item._id}>{item.name} - ₹{item.price.toLocaleString('en-IN')}</option>)
                        ) : (<option disabled>No compatible items found</option>)
                      )}
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="summary-panel">
            <h2>Your Build Summary</h2>
            {componentSections.map(section => (
              <div key={section.label} className="summary-item">
                <strong>{section.label}:</strong>
                <span>{findItemName(components[section.type === 'pcCase' ? 'pcCases' : section.type + 's'], selections[section.type])}</span>
              </div>
            ))}
            <div className="summary-total">
              <p>Total Price</p>
              <h3>₹{totalPrice.toLocaleString('en-IN')}</h3>
            </div>
            <button className="save-button" onClick={() => setIsModalOpen(true)}>
              Save Build
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;