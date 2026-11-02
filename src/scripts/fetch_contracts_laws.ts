import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function callWithRetry<T>(fn: () => Promise<T>, retries = 5, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 503 || error.status === 429 || error.message?.includes("503") || error.message?.includes("demand"))) {
      console.log(`Transient API error. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

function extractAndParseJSON(text: string): any {
  if (!text) return {};
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
  const cleanText = jsonMatch ? jsonMatch[1].trim() : text.trim();
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON. Raw text preview:", text.substring(0, 500));
    throw e;
  }
}

async function fetchSection5() {
  console.log("Fetching Section 5...");
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "يرجى تزويدي بالنص الرسمي الكامل والكامل جداً للفصول من 306 إلى 318 من قانون الالتزامات والعقود المغربي (القسم الخامس: بطلان الالتزامات وإبطالها). يرجى تقديمها ككتلة كود JSON صالحة ومحاطة بـ ```json ... ``` فقط وبدون أي نصوص إضافية، حيث المفتاح هو رقم الفصل (مثال: '306') والقيمة هي النص الرسمي للفصل.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return extractAndParseJSON(response.text || "{}");
  });
}

async function fetchSection6Part1() {
  console.log("Fetching Section 6 Part 1...");
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "يرجى تزويدي بالنص الرسمي الكامل والكامل جداً للفصول من 319 إلى 356 من قانون الالتزامات والعقود المغربي (القسم السادس: انقضاء الالتزامات - الوفاء واستحالة التنفيذ والإبراء والتجديد). يرجى تقديمها ككتلة كود JSON صالحة ومحاطة بـ ```json ... ``` فقط وبدون أي نصوص إضافية، حيث المفتاح هو رقم الفصل والقيمة هي النص الرسمي للفصل.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return extractAndParseJSON(response.text || "{}");
  });
}

async function fetchSection6Part2() {
  console.log("Fetching Section 6 Part 2...");
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "يرجى تزويدي بالنص الرسمي الكامل والكامل جداً للفصول من 357 إلى 398 من قانون الالتزامات والعقود المغربي (تتمة القسم السادس: المقاصة واتحاد الذمة والتقادم والإقالة). يرجى تقديمها ككتلة كود JSON صالحة ومحاطة بـ ```json ... ``` فقط وبدون أي نصوص إضافية، حيث المفتاح هو رقم الفصل والقيمة هي النص الرسمي للفصل.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return extractAndParseJSON(response.text || "{}");
  });
}

async function fetchSection7() {
  console.log("Fetching Section 7...");
  return callWithRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "يرجى تزويدي بالنص الرسمي الكامل والكامل جداً للفصول من 399 إلى 477 من قانون الالتزامات والعقود المغربي (القسم السابع: إثبات الالتزامات وإثبات البراءة منها). يرجى تقديمها ككتلة كود JSON صالحة ومحاطة بـ ```json ... ``` فقط وبدون أي نصوص إضافية، حيث المفتاح هو رقم الفصل والقيمة هي النص الرسمي للفصل.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return extractAndParseJSON(response.text || "{}");
  });
}

async function run() {
  try {
    const s5 = await fetchSection5();
    const s6_1 = await fetchSection6Part1();
    const s6_2 = await fetchSection6Part2();
    const s7 = await fetchSection7();

    const all = {
      ...s5,
      ...s6_1,
      ...s6_2,
      ...s7
    };

    const outPath = path.join(process.cwd(), "src/data/laws/fetched_306_477.json");
    fs.writeFileSync(outPath, JSON.stringify(all, null, 2), "utf-8");
    console.log("SUCCESS! Written to: " + outPath);
  } catch (error) {
    console.error("Error running script:", error);
  }
}

run();
