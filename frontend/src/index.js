import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { Auth0Provider } from '@auth0/auth0-react';
import LoginButton from "./login-signup";
import  StoreContextProvider  from './context/StoreContext.jsx';
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StoreContextProvider>
  <Auth0Provider
    domain="dev-xu1qpz2yn7s8k0dl.us.auth0.com"
    clientId="aPrgvwMdx6PWDpVy1DwC8UOox3jRUILD"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}>
    
    <BrowserRouter>
    <App />
    </BrowserRouter>
    
    
    
  </Auth0Provider>
  </StoreContextProvider>
);



