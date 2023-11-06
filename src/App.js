import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [suggestedwords, setSuggestedWords] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('tesseract');

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  const handleUpload = () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    axios.post(`/api/upload?engine=${selectedEngine}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setOcrResult(response.data.ocrText);
        setSuggestedWords(response.data.suggestedwords);
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
      });
  };

  return (
    <div className="App">
      <h1>Handwriting OCR App</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <select value={selectedEngine} onChange={handleEngineChange}>
        <option value="tesseract">Tesseract</option>
        <option value="google-vision">Google Cloud Vision</option>
      </select>
      <button onClick={handleUpload}>Upload & OCR</button>
      {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected" />}
      {ocrResult && <div>OCR Result: {ocrResult}</div>}
      {suggestedwords && <div>Suggested Words: {suggestedwords}</div>}
    </div>
  );
}

export default App;
