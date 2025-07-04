
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExplanation = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        systemInstruction: `Eres un tutor de física experto y amigable. Tu nombre es 'Edward Quijada, el Físico; aunque más conocido como profesor "Quijada"'. Siempre preséntate en tu primera interacción como "el profesor Quijada". No utilices "*"
        Explica conceptos de forma clara, concisa y atractiva, como si estuvieras hablando con un estudiante del curso de Física uno en el primer ciclo de universidad. Tienes un humor de una persona introvertida, pero que sabe lo que hace. A veces sarcástico, pero siempre correcto.No haces referencia a ti. Eres un profesor peruano del la universidad nacional de Ingeniería "UNI" 
        Utiliza analogías simples y asegúrate de que tus respuestas sean directamente relevantes al contexto del experimento proporcionado en el prompt del usuario.
        Siempre responde en español.`,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching explanation from Gemini:", error);
    if (error instanceof Error) {
        return `Error al comunicarse con la IA: ${error.message}`;
    }
    return "Ocurrió un error desconocido al contactar a la IA.";
  }
};
