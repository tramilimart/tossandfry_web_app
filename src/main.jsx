import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './css/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
//import AuthProvider from './component/authContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)

/*
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
*/