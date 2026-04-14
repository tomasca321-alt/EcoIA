import { ClassificationResult } from '../types';

export async function analyzeImage(base64Image: string, apiKey: string): Promise<ClassificationResult> {
  const prompt = `Eres un auditor ambiental experto con precisión absoluta en la clasificación de residuos sólidos.
Analiza la imagen detalladamente. Identifica el residuo principal y la caneca (si aparece de fondo) para determinar si la clasificación es correcta.

REGLAS ESTRICTAS DE CLASIFICACIÓN:
- CANECA VERDE: Residuos orgánicos aprovechables (restos de comida, cáscaras, vegetales, café, hojas).
- CANECA BLANCA: Residuos aprovechables/reciclables ESTRICTAMENTE LIMPIOS Y SECOS (plástico, botellas, vidrio, metales, latas, papel, cartón limpio).
- CANECA NEGRA: Residuos NO aprovechables (papel higiénico, servilletas sucias, empaques metalizados de snacks, cartón con grasa como cajas de pizza, icopor, tapabocas, residuos de barrido).

REGLA DE ORO: Si un residuo reciclable (plástico, cartón, etc.) está sucio, engrasado o contiene restos de comida, PIERDE su potencial de reciclaje y DEBE ir a la CANECA NEGRA.
ACLARACIÓN DE DOBLE CANECA: Si un residuo está compuesto por partes que van en diferentes canecas (ej. botella de plástico con líquido, o envase con tapa de otro material), o si su clasificación depende de una acción (ej. "si lo lavas va a la blanca, si no, a la negra"), DEBES hacer esta aclaración explícita en el "motivo".

Instrucciones de evaluación:
1. Identifica el residuo y su estado (limpio/sucio).
2. Identifica si hay una caneca de fondo y su color.
3. Si el residuo está en la caneca correcta según las reglas, es_correcto es true y puntos es 10.
4. Si está en la incorrecta, es_correcto es false, puntos es 0, y color_sugerido es el color correcto.

Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:
{
  "es_correcto": true o false,
  "puntos": 10 o 0,
  "color_sugerido": "verde" | "blanca" | "negra" | null,
  "analisis_detallado": {
    "material": "Nombre del material (ej. Botella de plástico PET)",
    "estado": "Limpio y seco / Sucio con grasa / etc.",
    "motivo": "Explicación directa de por qué pertenece a esa caneca. Si aplica a dos canecas dependiendo de una acción (ej. lavar/separar), haz la aclaración aquí.",
    "tip_ecologico": "Un dato curioso o consejo breve sobre el impacto de reciclar este material."
  }
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Image.split(',')[1]
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    throw new Error('Error en la API de Gemini');
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  try {
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanText);
    
    return {
      es_correcto: parsed.es_correcto || false,
      puntos: parsed.puntos || 0,
      color_sugerido: parsed.color_sugerido || "",
      explicacion: parsed.explicacion || "",
      analisis_detallado: parsed.analisis_detallado,
      raw_text: text
    };
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error('Respuesta inválida de la IA');
  }
}

export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
