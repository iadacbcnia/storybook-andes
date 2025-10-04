// src/app/api/ia/route.js
export async function POST(request) {
  try {
    const { fotos, respuestas } = await request.json();

    // 🔑 Usa la clave de andes-app (la que ya funciona)
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return Response.json({ 
        historia: "Error: Clave de API no configurada en el servidor." 
      });
    }

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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error de la API de Gemini:", error);
      return Response.json({ 
        historia: "Lo siento, no pude generar tu historia en este momento. Inténtalo más tarde." 
      });
    }

    const data = await response.json();
    const historia = data.candidates[0].content.parts[0].text;

    return Response.json({ historia });
  } catch (error) {
    console.error("Error en el endpoint de IA:", error);
    return Response.json({ 
      historia: "Hubo un error al generar tu historia. Por favor, inténtalo de nuevo." 
    });
  }
}