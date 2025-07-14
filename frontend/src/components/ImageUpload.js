// ImageUpload.js
import React, { useState } from 'react';

const ImageUpload = ({ onResult, productId }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
    setError(null);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    if (!productId) {
      alert("Scan a product first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('productId', productId);  // Attach productId

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:5000/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Unknown error');
      onResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {
        preview && (
        <div className="preview">
          <p>Preview:</p>
          <img src={preview} alt="Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Processing...' : 'Upload & Verify'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ImageUpload;
