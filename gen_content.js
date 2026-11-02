import { generateContent } from './src/lib/gemini';
import fs from 'fs';

async function generateLessons() {
  const systemInstruction = `أنت خبير في القانون المغربي والشريعة الإسلامية.
  مهمتك هي توليد محتوى تعليمي مفصل وأكاديمي لدروس جامعية.
  يجب أن يكون المحتوى باللغة العربية الفصحى، رصيناً، ومنظماً.
  
  كل قسم يجب أن يتبع هذا الهيكل:
  {
    "title": "عنوان القسم",
    "content": ["فقرة 1", "فقرة 2", ...],
    "diagram": { // اختياري
      "type": "relation" | "comparison",
      "nodes": ["نود 1", "نود 2"], // لـ relation
      "label": "تسمية",
      "left": "طرف 1", // لـ comparison
      "right": "طرف 2",
      "center": "مركز"
    }
  }
  
  أرجع مصفوفة من الأقسام بصيغة JSON فقط.`;

  const lawPrompt = `أكمل دروس "مدخل لدراسة القانون" من القسم 9 إلى القسم 50.
  المواضيع: مصادر القانون، أنواع التشريع، الرقابة، التفسير، نطاق التطبيق، تقسيمات القانون (عام وخاص)، فروع القانون، نظرية الحق (تعريف، أنواع، أركان، مصادر، إثبات، انقضاء).
  اجعل الفقرات طويلة ومعمقة جداً. ولد 42 قسماً.`;

  const shariaPrompt = `أكمل دروس "مدخل لدراسة الشريعة" من القسم 5 إلى القسم 50.
  المواضيع: خصائص الشريعة، المصادر الأصلية والتبعية، مقاصد الشريعة، المذاهب الفقهية، الاجتهاد، فقه المعاملات، الجنايات في الشريعة، نظام الأسرة، الأخلاق، الشريعة والقانون الوضعي.
  اجعل الفقرات طويلة ومعمقة جداً. ولد 46 قسماً.`;

  try {
    console.log('Generating Law Content...');
    const lawResponse = await generateContent({
      model: "gemini-1.5-pro",
      contents: [{ role: 'user', parts: [{ text: lawPrompt }] }],
      config: { systemInstruction, responseMimeType: "application/json" }
    });
    fs.writeFileSync('law_content.json', lawResponse.candidates[0].content.parts[0].text);
    console.log('Generated Law Content');

    console.log('Generating Sharia Content...');
    const shariaResponse = await generateContent({
      model: "gemini-1.5-pro",
      contents: [{ role: 'user', parts: [{ text: shariaPrompt }] }],
      config: { systemInstruction, responseMimeType: "application/json" }
    });
    fs.writeFileSync('sharia_content.json', shariaResponse.candidates[0].content.parts[0].text);
    console.log('Generated Sharia Content');
  } catch (e) {
    console.error(e);
  }
}

generateLessons();
