import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🌱 Green Groves</h1>
      <p>Welcome to Green Groves Gardening SPA</p>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h2>✅ React App is Working!</h2>
        <p>If you can see this, the basic React app is functioning correctly.</p>
      </div>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h3>🔧 Debug Information</h3>
        <p>Current URL: {window.location.href}</p>
        <p>User Agent: {navigator.userAgent}</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

export default App;
