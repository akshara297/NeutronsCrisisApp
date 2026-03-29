import React, { useState, useEffect } from 'react';

export default function App() {
  // --- STATE ---
  const [userName, setUserName] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [location, setLocation] = useState("GPS Standby");
  const [mapUrl, setMapUrl] = useState("");
  const [sosActive, setSosActive] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [activeGuide, setActiveGuide] = useState(null);
  const [safetyStatus, setSafetyStatus] = useState(null); // 'safe' or 'unsafe'

  const guides = {
    fire: ["Stay low to the floor.", "Touch doors before opening.", "Use stairs, never elevators."],
    medical: ["Apply pressure to wounds.", "Keep the person warm.", "Do not move if neck injury."],
    earthquake: ["Drop, Cover, and Hold on.", "Stay away from glass.", "Wait for shaking to stop."]
  };

  useEffect(() => {
    const savedName = localStorage.getItem('neutron-user');
    if (savedName) { setUserName(savedName); setCheckedIn(true); }
  }, []);

  const getRealLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Not Supported");
      return;
    }
    setLocation("Locating...");
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude.toFixed(4);
      const lng = position.coords.longitude.toFixed(4);
      setLocation(`${lat}, ${lng}`);
      // The most stable embed format for Google Maps
      setMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
    }, () => setLocation("GPS Error"));
  };

  return (
    <div style={{ backgroundColor: sosActive ? '#450a0a' : '#0f172a', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: 'sans-serif' }}>
      
      {/* SOS FULL-SCREEN OVERLAY */}
      {sosActive && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#dc2626', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '2rem', textAlign: 'center' }}>SOS ACTIVE</h1>
          <button onClick={() => setSosActive(false)} style={{ width: '100%', maxWidth: '300px', padding: '20px', backgroundColor: 'white', color: '#dc2626', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>STOP ALARM</button>
        </div>
      )}

      {/* FIRE EXIT / SAFE PATH OVERLAY */}
      {showPath && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#020617', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ fontSize: '5rem', marginBottom: '10px' }}>⬆️</div>
          <h2 style={{ fontSize: '3rem', color: '#22c55e', fontWeight: '900', marginBottom: '10px' }}>EXIT NORTH</h2>
          <p style={{ color: '#94a3b8', marginBottom: '40px', textAlign: 'center' }}>Follow green emergency lights to Assembly Point A.</p>
          <button onClick={() => setShowPath(false)} style={{ width: '100%', maxWidth: '300px', padding: '15px', backgroundColor: '#334155', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>BACK TO DASHBOARD</button>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div style={{ maxWidth: '420px', width: '100%', backgroundColor: '#1e293b', border: '2px solid #ef4444', borderRadius: '32px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        
        {/* HEADER: USER IDENTITY */}
        <div style={{ marginBottom: '20px' }}>
          {!checkedIn ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Enter your name" value={userName} onChange={(e) => setUserName(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none' }} />
              <button onClick={() => { localStorage.setItem('neutron-user', userName); setCheckedIn(true); }} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Check In</button>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Welcome, {userName}</h1>
              <button onClick={() => { localStorage.removeItem('neutron-user'); setUserName(""); setCheckedIn(false); }} style={{ padding: '8px 16px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
            </div>
          )}
        </div>

        {/* LOCATION & MAP */}
        <div style={{ marginBottom: '20px' }}>
          <button onClick={getRealLocation} style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}>📍 Get GPS Location</button>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '10px' }}>{location}</p>
          {mapUrl && <iframe title="location-map" src={mapUrl} width="100%" height="250" style={{ borderRadius: '12px', border: 'none' }}></iframe>}
        </div>

        {/* EMERGENCY BUTTONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => setSosActive(true)} style={{ padding: '16px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>🚨 SOS</button>
          <button onClick={() => setShowPath(true)} style={{ padding: '16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>🚪 FIRE EXIT</button>
        </div>

        {/* SAFETY GUIDES */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '10px', color: '#94a3b8' }}>Safety Guides:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {Object.keys(guides).map(key => (
              <button key={key} onClick={() => setActiveGuide(activeGuide === key ? null : key)} style={{ padding: '12px', backgroundColor: activeGuide === key ? '#ef4444' : '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'capitalize' }}>{key}</button>
            ))}
          </div>
          {activeGuide && (
            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#0f172a', borderLeft: '4px solid #ef4444', borderRadius: '8px' }}>
              {guides[activeGuide].map((step, idx) => <p key={idx} style={{ margin: '8px 0', color: '#e2e8f0' }}>• {step}</p>)}
            </div>
          )}
        </div>

        {/* SAFETY STATUS */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setSafetyStatus('safe')} style={{ flex: 1, padding: '12px', backgroundColor: safetyStatus === 'safe' ? '#22c55e' : '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✓ Mark Safe</button>
          <button onClick={() => setSafetyStatus('unsafe')} style={{ flex: 1, padding: '12px', backgroundColor: safetyStatus === 'unsafe' ? '#dc2626' : '#334155', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✗ Mark Unsafe</button>
        </div>
      </div>
    </div>
  );
}