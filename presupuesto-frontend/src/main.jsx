import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="601881212906-raerpl4n22o2r55uf01433orv5uta3b4.apps.googleusercontent.com">
          <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
