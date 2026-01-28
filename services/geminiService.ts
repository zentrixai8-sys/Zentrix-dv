
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};

export const getCareerAdvice = async (userPrompt: string): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      return "System offline. API configuration missing. Please contact ZENTRIX at 7089935002.";
    }

    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: "You are the Senior Technical Architect at ZENTRIX. Your goal is to explain how our custom software, AI WhatsApp Automation, and Cloud Infrastructure can revolutionize a business. Be helpful, professional, and focus on the technical excellence of ZENTRIX. Always encourage users to contact us at 7089935002 for a personalized consultation.",
        temperature: 0.7,
      },
    });

    return response.text || "Communication delay. Please contact ZENTRIX directly at 7089935002.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The system is currently syncing. Reach out to ZENTRIX at 7089935002 for immediate assistance.";
  }
};
