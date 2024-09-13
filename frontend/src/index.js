import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { Auth0Provider } from '@auth0/auth0-react';
import LoginButton from "./login-signup";
import  StoreContextProvider  from './context/StoreContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import AuthContextProvider from './adminPanel/AuthContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StoreContextProvider>
  
    
    <BrowserRouter>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
        
    </BrowserRouter>
    
    
    
  
  </StoreContextProvider>
);
