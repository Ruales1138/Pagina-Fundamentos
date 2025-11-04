// src/services/aiService.js
const OpenAI = require("openai");
const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

// Inicializar cliente de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extrae texto de un archivo PDF
 * @param {string} filePath - Ruta del archivo PDF
 * @returns {Promise<string>} - Texto extraído del PDF
 */
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extrayendo texto del PDF:", error);
    throw new Error("No se pudo leer el archivo PDF");
  }
}

/**
 * Analiza un CV usando GPT-4 y calcula un score de compatibilidad
 * @param {string} cvText - Texto del CV (puede ser extraído de PDF o texto directo)
 * @param {string} cvPath - Ruta del archivo CV (opcional, para PDFs)
 * @param {Array} requisitos - Requisitos de la convocatoria
 * @param {Array} habilidades - Habilidades requeridas
 * @returns {Promise<number>} - Score de 0 a 100
 */
async function analyzeCVWithAI(cvText, cvPath, requisitos = [], habilidades = []) {
  try {
    // Si hay un archivo PDF, extraer el texto
    let fullText = cvText || "";
    if (cvPath && cvPath.endsWith(".pdf")) {
      const absolutePath = path.join(__dirname, "../..", cvPath);
      if (fs.existsSync(absolutePath)) {
        const extractedText = await extractTextFromPDF(absolutePath);
        fullText += "\n\n" + extractedText;
      }
    }

    // Si no hay texto para analizar, retornar score básico
    if (!fullText.trim()) {
      return scoreProfileBasic(fullText, requisitos, habilidades);
    }

    // Construir el prompt para GPT-4
    const prompt = `
Eres un experto en recursos humanos especializado en evaluar hojas de vida para posiciones de monitoria académica en ingeniería.

**HOJA DE VIDA DEL CANDIDATO:**
${fullText}

**REQUISITOS DE LA POSICIÓN:**
${requisitos.length > 0 ? requisitos.join("\n- ") : "No especificados"}

**HABILIDADES REQUERIDAS:**
${habilidades.length > 0 ? habilidades.join("\n- ") : "No especificadas"}

**INSTRUCCIONES:**
Analiza la hoja de vida del candidato y evalúa su compatibilidad con los requisitos y habilidades solicitadas.

Considera los siguientes criterios:
1. **Experiencia académica** (30%): Promedio, semestre, materias cursadas relevantes
2. **Habilidades técnicas** (30%): Conocimientos específicos, herramientas, lenguajes de programación
3. **Experiencia previa** (20%): Monitorias anteriores, proyectos, trabajos relacionados
4. **Competencias blandas** (10%): Comunicación, liderazgo, trabajo en equipo
5. **Disponibilidad y compromiso** (10%): Horarios, dedicación mencionada

Responde ÚNICAMENTE con un número entero entre 0 y 100 que represente el porcentaje de compatibilidad. No incluyas texto adicional, solo el número.
`;

    // Llamar a la API de OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo más económico pero efectivo
      messages: [
        {
          role: "system",
          content: "Eres un experto evaluador de hojas de vida. Respondes únicamente con números entre 0 y 100.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Baja temperatura para respuestas más consistentes
      max_tokens: 10, // Solo necesitamos un número
    });

    // Extraer el score de la respuesta
    const scoreText = response.choices[0].message.content.trim();
    const score = parseInt(scoreText, 10);

    // Validar que el score esté en el rango correcto
    if (isNaN(score) || score < 0 || score > 100) {
      console.warn("Score inválido de IA, usando método básico");
      return scoreProfileBasic(fullText, requisitos, habilidades);
    }

    console.log(`✅ IA analizó CV: Score = ${score}%`);
    return score;
  } catch (error) {
    console.error("Error al analizar CV con IA:", error.message);
    // Fallback al método básico si falla la IA
    return scoreProfileBasic(cvText, requisitos, habilidades);
  }
}

/**
 * Método básico de scoring (fallback si falla la IA)
 * @param {string} perfil - Texto del perfil
 * @param {Array} requisitos - Requisitos
 * @param {Array} habilidades - Habilidades
 * @returns {number} - Score de 0 a 100
 */
function scoreProfileBasic(perfil, requisitos = [], habilidades = []) {
  if (!perfil) return 0;
  const text = perfil.toLowerCase();
  const tokens = [...requisitos, ...habilidades]
    .filter(Boolean)
    .map((t) => String(t).toLowerCase());
  if (tokens.length === 0) return 0;
  const matches = tokens.reduce((acc, t) => acc + (text.includes(t) ? 1 : 0), 0);
  return Math.round((matches / tokens.length) * 100);
}

module.exports = {
  analyzeCVWithAI,
  extractTextFromPDF,
  scoreProfileBasic,
};
