import React from 'react';

const EnvironmentDebug: React.FC = () => {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  // Only show in development or when explicitly enabled
  const isDev = import.meta.env.DEV;
  const showDebug = isDev || import.meta.env.VITE_SHOW_ENV_DEBUG === 'true';

  if (!showDebug) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '400px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <h4>Environment Variables Debug</h4>
      <div>Mode: {import.meta.env.MODE}</div>
      <div>DEV: {import.meta.env.DEV ? 'true' : 'false'}</div>
      <div>PROD: {import.meta.env.PROD ? 'true' : 'false'}</div>
      <hr />
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {
            value 
              ? `${value.substring(0, 10)}...` 
              : '<undefined>'
          }
        </div>
      ))}
      <hr />
      <div>All env keys: {Object.keys(import.meta.env).filter(k => k.startsWith('VITE')).join(', ')}</div>
    </div>
  );
};

export default EnvironmentDebug;
