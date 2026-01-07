import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateProductDescription = async (productName: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !productName.trim()) return "";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Eres un experto redactor gastronómico peruano. Genera una descripción breve (máximo 120 caracteres), provocativa y elegante para un plato llamado "${productName}". Usa palabras que despierten el apetito y reflejen la calidad de la cocina peruana.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "";
  } catch (error) {
    console.error("Error Gemini:", error);
    return "";
  }
};