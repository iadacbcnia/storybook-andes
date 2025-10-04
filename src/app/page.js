'use client';

import { useState, useRef } from 'react';
import { FaTrash, FaArrowLeft, FaDownload, FaWhatsapp, FaMicrophone } from 'react-icons/fa';

// === FUNCIÓN DE IA CON GEMINI ===
async function generarHistoriaConIA(fotos, respuestas) {
  // 🔑 PONÉ ACÁ TU CLAVE DE GEMINI (la que creaste en Google AI Studio)
  // La clave se usa en el servidor, no en el cliente

  const prompt = `
    Eres Andes, un guía de viaje poético y amigable de la Comarca Andina.
    Un turista compartió:
    - Lugar que le impactó: "${respuestas.q1 || 'un rincón secreto'}"
    - Emoción sentida: "${respuestas.q2 || 'asombro'}"
    - Recuerdo para siempre: "${respuestas.q3 || 'una caminata inolvidable'}"
    - Más detalles: "${respuestas.extra || 'no dio más información'}"

    Además subió ${fotos.length} fotos de su viaje.

    Basado en eso, crea una historia corta (máx. 120 palabras), emotiva y poética,
    como si fuera un recuerdo para su libro de viaje.
    Usa un tono cálido, inspirador y con referencias a la naturaleza andina.
    No menciones que usaste IA. Sé natural, como un verdadero guía local.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error en IA:", error);
    return `¡Gracias por tu aventura en la Comarca Andina!\n\n(La IA no está disponible ahora, pero tu historia es igual de valiosa.)`;
  }
}

export default function StorybookApp() {
  const [images, setImages] = useState([]);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    extra: ''
  });
  const [story, setStory] = useState('');
  const [generating, setGenerating] = useState(false);

  // --- SUBIDA DE FOTOS ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 10 - images.length);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // --- RECONOCIMIENTO DE VOZ ---
  const startDictation = (field) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Tu navegador no soporta dictado de voz.");
      return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-AR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers(prev => ({ ...prev, [field]: transcript }));
    };

    recognition.onerror = (event) => {
      console.error("Error en dictado:", event.error);
    };
  };

  // --- MANEJO DE RESPUESTAS ---
  const handleAnswerChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  // --- GENERAR HISTORIA CON IA ---
  const handleGenerate = async () => {
  setGenerating(true);
  try {
    const response = await fetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fotos: images, respuestas: answers })
    });
    const data = await response.json();
    setStory(data.historia);
  } catch (error) {
    setStory("¡Gracias por tu aventura en la Comarca Andina!\n\n(La IA no está disponible ahora, pero tu historia es igual de valiosa.)");
  }
  setGenerating(false);
};

  // --- BOTONES DE ACCIÓN ---
  const handleDownloadPDF = () => {
    alert("Función de PDF en desarrollo.");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`¡Mira mi Storybook de la Comarca Andina!\n\n"${story}"`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-blue-50 p-4">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-800">📖 Mi Storybook de la Comarca Andina</h1>
        <p className="text-gray-600">Crea tu libro de viaje personalizado con Andes</p>
      </header>

      {!story ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          {/* --- SUBIDA DE FOTOS --- */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">📸 Fotos de tu viaje ({images.length}/10)</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={images.length >= 10}
              className="mb-4 w-full"
            />
            <div className="flex flex-wrap gap-3">
              {images.map((src, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img
                    src={src}
                    alt={`Foto ${i+1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-emerald-300"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* --- PREGUNTAS CON MICRÓFONO --- */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">📝 Contanos tu experiencia</h2>
            <div className="space-y-4">
              {[
                { key: 'q1', label: '1. ¿Qué lugar de la Comarca Andina te impactó más?' },
                { key: 'q2', label: '2. ¿Qué emoción sentiste al estar allí?' },
                { key: 'q3', label: '3. ¿Qué recuerdo te llevás para siempre?' }
              ].map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-medium">{q.label}</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={answers[q.key]}
                      onChange={(e) => handleAnswerChange(q.key, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => startDictation(q.key)}
                      className="bg-gray-200 p-2 rounded hover:bg-gray-300"
                      title="Dictar con micrófono"
                    >
                      <FaMicrophone size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium">Contanos más (opcional):</label>
                <div className="flex gap-2 mt-1">
                  <textarea
                    value={answers.extra}
                    onChange={(e) => handleAnswerChange('extra', e.target.value)}
                    rows="3"
                    className="flex-1 p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => startDictation('extra')}
                    className="bg-gray-200 p-2 rounded hover:bg-gray-300 self-end"
                    title="Dictar con micrófono"
                  >
                    <FaMicrophone size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- BOTONES --- */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-1"
            >
              <FaArrowLeft /> Volver
            </button>
            <button
              onClick={handleGenerate}
              disabled={images.length === 0 || generating}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
            >
              {generating ? 'Generando...' : 'Generar Storybook'}
            </button>
          </div>
        </div>
      ) : (
        /* --- VISTA DEL STORYBOOK --- */
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-center mb-4">✨ Tu Storybook está listo</h2>
          
          {/* Fotos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">📸 Tus fotos</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {images.map((src, i) => (
                <div key={i} className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-inner"></div>
                  <img
                    src={src}
                    alt={`Foto ${i+1}`}
                    className="relative w-full h-full object-cover rounded-lg border-4 border-amber-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Historia */}
          <div className="bg-emerald-50 p-4 rounded-lg mb-6 border border-emerald-200">
  <p className="whitespace-pre-line text-gray-900 font-medium">{story}</p>
</div>

          {/* Botones finales */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setStory('')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-1"
            >
              <FaArrowLeft /> Editar
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-1"
            >
              <FaDownload /> Descargar PDF
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-1"
            >
              <FaWhatsapp /> WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}