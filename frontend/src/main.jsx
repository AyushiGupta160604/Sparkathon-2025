import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Heatmap from './pages/Heatmap.jsx'
import Dashboard from './pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/heatmap" element={<Heatmap />} />
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </Router>
  </StrictMode>,
)