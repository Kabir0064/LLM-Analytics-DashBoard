import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from 'react-oidc-context';

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_WMxnVVM17',
  client_id: '6og50cbjsn0apa6uav7132qp14',
  redirect_uri: 'http://localhost:5173', // Change to your deployed URL if needed
  response_type: 'code',
  scope: 'openid email phone',
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);