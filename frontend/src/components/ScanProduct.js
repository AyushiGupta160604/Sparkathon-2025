// frontend/src/components/ScanProduct.js
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScanProduct = ({ onScanComplete }) => {
  const [labelImage, setLabelImage] = useState(null);
  const [scannedId, setScannedId] = useState(null);

  // 📷 Live barcode scanning
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scanner.render(
      (decodedText) => {
        setScannedId(decodedText);  // Save barcode
        alert(`Barcode Scanned: ${decodedText}`);
        scanner.clear();
      },
      (error) => {
        console.warn("Scan error", error);
      }
    );
  }, []);

  // 🛠️ Call /scan after /scan-label is successful
  const scanProduct = async (productId) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      });

      const data = await res.json();
      console.log("[DEBUG] /scan response:", data);
      return data;
    } catch (err) {
      console.error("Scan failed", err);
      return null;
    }
  };

  // 📤 Label image upload (for OCR)
  const handleLabelImageUpload = async () => {
    if (!labelImage) {
      alert("Please upload label image.");
      return;
    }

    if (!scannedId) {
      alert("Please scan barcode first.");
      return;
    }

    const formData = new FormData();
    formData.append("labelImage", labelImage);
    formData.append("productId", scannedId);

    const res = await fetch("http://127.0.0.1:5000/scan-label", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.productId) {
      // ✅ Now also call /scan to register and confirm
      const scanData = await scanProduct(data.productId);

      if (scanData && scanData.productId) {
        onScanComplete(scanData.productId);
        alert("Product scanned and saved!");
      } else {
        alert("Product label uploaded, but verification failed.");
      }
    } else {
      alert("Failed to scan label.");
    }
  };

  return (
    <div>
      <h2>Step 1: Scan Barcode</h2>
      <div id="reader" style={{ width: "500px" }}></div>

      <h2>Step 2: Upload Label Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setLabelImage(e.target.files[0])}
      />
      <button onClick={handleLabelImageUpload}>
        Upload Label & Extract Details
      </button>
    </div>
  );
};

export default ScanProduct;
