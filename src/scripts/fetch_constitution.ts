import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getConstitutionArticles() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "يرجى تزويدي بالنص الكامل للفصول من 11 إلى 30 من الدستور المغربي 2011. يرجى تنسيقها ككائن JSON حيث المفتاح هو رقم الفصل والقيمة هي النص.",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  console.log(response.text);
}

getConstitutionArticles();
