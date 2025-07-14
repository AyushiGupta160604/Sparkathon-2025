// App.js
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ResultDisplay from './components/ResultDisplay';
import ScanProduct from './components/ScanProduct';
import './App.css';
import logo from './logo.png';

const App = () => {
  const [result, setResult] = useState(null);
  const [productId, setProductId] = useState(null);  // Store scanned productId

  const handleResult = (resultData) => {
    setResult(resultData);
  };

  const handleScan = async (scannedCode) => {
    setProductId(scannedCode);  // Save to state immediately

    const response = await fetch('http://127.0.0.1:5000/scan', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: scannedCode
      })
    });

    const data = await response.json();
    alert(data.message || "Scan processed.");
    console.log(data);
  };

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Smart Vision Logo" className="logo" />
      </header>
      <h1>Smart Product Verification</h1>
      <p>Scan a product QR code, upload an image of the open box, and verify authenticity.</p>

      {/* Step 1️⃣: Scan QR to get productId */}
      <ScanProduct onScanComplete={handleScan} />

      {/* Step 2️⃣: Upload open box image with stored productId */}
      <ImageUpload onResult={handleResult} productId={productId} />

      {/* Step 3️⃣: Result display */}
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default App;
