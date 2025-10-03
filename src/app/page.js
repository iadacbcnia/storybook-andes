'use client';

import { useState } from 'react';
import { FaTrash, FaArrowLeft, FaDownload, FaWhatsapp } from 'react-icons/fa';

export default function StorybookApp() {
  const [images, setImages] = useState([]);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    extra: ''
  });
  const [story, setStory] = useState('');

  // Subir imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - images.length);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  // Eliminar imagen
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Cambiar respuestas
  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Generar historia (simulado por ahora)
  const handleGenerate = () => {
    const fakeStory = `Basado en tus fotos y respuestas:
- Lugar: ${answers.q1 || 'un rincón secreto'}
- Emoción: ${answers.q2 || 'asombro'}
- Recuerdo: ${answers.q3 || 'una caminata inolvidable'}

${answers.extra || ''}

¡Gracias por compartir tu aventura en los Andes!`;
    setStory(fakeStory);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>📖 Mi Storybook de los Andes</h1>
        <p>Crea tu libro de viaje personalizado</p>
      </header>

      {!story ? (
        <>
          {/* Subida de fotos */}
          <section style={{ marginBottom: '30px' }}>
            <h2>Fotos de tu viaje ({images.length}/10)</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length >= 10}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
              {images.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={src} alt={`Foto ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Preguntas */}
          <section style={{ marginBottom: '30px' }}>
            <h2>Contanos tu experiencia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label><strong>1. ¿Qué lugar de los Andes te impactó más?</strong></label>
                <input
                  type="text"
                  value={answers.q1}
                  onChange={(e) => handleAnswerChange('q1', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label><strong>2. ¿Qué emoción sentiste al estar allí?</strong></label>
                <input
                  type="text"
                  value={answers.q2}
                  onChange={(e) => handleAnswerChange('q2', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label><strong>3. ¿Qué recuerdo te llevás para siempre?</strong></label>
                <input
                  type="text"
                  value={answers.q3}
                  onChange={(e) => handleAnswerChange('q3', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <label><strong>Contanos más (opcional):</strong></label>
                <textarea
                  value={answers.extra}
                  onChange={(e) => handleAnswerChange('extra', e.target.value)}
                  rows="4"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
            </div>
          </section>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => window.history.back()}
              style={{ padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              <FaArrowLeft /> Volver
            </button>
            <button
              onClick={handleGenerate}
              disabled={images.length === 0}
              style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: images.length === 0 ? 0.5 : 1 }}
            >
              Generar Storybook
            </button>
          </div>
        </>
      ) : (
        /* Vista de Storybook */
        <div style={{ textAlign: 'center' }}>
          <h2>✨ Tu Storybook está listo</h2>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            padding: '20px', 
            margin: '20px 0',
            background: 'white',
            minHeight: '300px'
          }}>
            <p style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>{story}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStory('')}
              style={{ padding: '10px 20px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              <FaArrowLeft /> Editar
            </button>
            <button
              style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              <FaDownload /> Descargar PDF
            </button>
            <button
              style={{ padding: '10px 20px', background: '#25D366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              <FaWhatsapp /> Enviar por WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}