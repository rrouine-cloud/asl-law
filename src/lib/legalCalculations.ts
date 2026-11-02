
export interface AccidentInput {
  age: number;
  monthlyIncome: number;
  hasIncomeProof: boolean;
  ittDays: number;
  ippPercentage: number;
  needsThirdPerson: boolean;
  painSeverity: string;
  disfigurementSeverity: string;
  careerImpact: string;
  studyInterruption: string;
  isDeathCase: boolean;
}

export interface AccidentResult {
  total: number;
  breakdown: {
    category: string;
    amount: number;
    details: string;
    legalBasis: string;
  }[];
  summary: string;
}

const AGE_COEFFICIENTS = [
  { max: 15, coeff: 19.8 },
  { max: 20, coeff: 18.6 },
  { max: 25, coeff: 17.5 },
  { max: 30, coeff: 16.5 },
  { max: 35, coeff: 15.4 },
  { max: 40, coeff: 14.2 },
  { max: 45, coeff: 13.0 },
  { max: 50, coeff: 11.8 },
  { max: 55, coeff: 10.5 },
  { max: 60, coeff: 9.3 },
  { max: 120, coeff: 8.0 },
];

const SMIG_ANNUAL = 37440; // Approx 3120 * 12

export function calculateAccidentCompensationLocal(input: AccidentInput): AccidentResult {
  const annualIncome = input.monthlyIncome > 0 ? input.monthlyIncome * 12 : SMIG_ANNUAL;
  const dailyIncome = annualIncome / 365;
  
  const coeffObj = AGE_COEFFICIENTS.find(c => input.age <= c.max) || { coeff: 8.0 };
  const ageCoeff = coeffObj.coeff;
  const capital = annualIncome * ageCoeff;

  const breakdown: AccidentResult['breakdown'] = [];
  let total = 0;

  // 1. ITT (Temporary Disability)
  if (input.ittDays > 0) {
    const ittAmount = dailyIncome * input.ittDays;
    breakdown.push({
      category: "التعويض عن العجز المؤقت (ITT)",
      amount: Math.round(ittAmount),
      details: `حساب بناء على ${input.ittDays} يوم عجز (الأجر اليومي: ${Math.round(dailyIncome)} د.م)`,
      legalBasis: "المادة 3 من ظهير 1984"
    });
    total += ittAmount;
  }

  // 2. IPP (Permanent Disability)
  if (input.ippPercentage > 0) {
    const ippAmount = annualIncome * (input.ippPercentage / 100) * ageCoeff;
    breakdown.push({
      category: "التعويض عن العجز الدائم (IPP)",
      amount: Math.round(ippAmount),
      details: `حساب بناء على نسبة ${input.ippPercentage}% ومعامل سن ${ageCoeff}`,
      legalBasis: "المادة 5 من ظهير 1984"
    });
    total += ippAmount;

    // 3. Third Person
    if (input.needsThirdPerson && input.ippPercentage >= 50) {
      const thirdPersonAmount = ippAmount * 0.25; // Minimum 25%
      breakdown.push({
        category: "الاستعانة بشخص آخر",
        amount: Math.round(thirdPersonAmount),
        details: "تعويض إضافي بنسبة 25% من تعويض العجز الدائم",
        legalBasis: "المادة 10 من ظهير 1984"
      });
      total += thirdPersonAmount;
    }
  }

  // 4. Pain (Pretium Doloris)
  const painMap: Record<string, number> = { light: 0.02, important: 0.05, very_important: 0.08 };
  if (input.painSeverity !== 'none' && painMap[input.painSeverity]) {
    const painAmount = capital * painMap[input.painSeverity];
    breakdown.push({
      category: "التعويض عن الألم الجسماني",
      amount: Math.round(painAmount),
      details: `تقدير بناء على شدة الألم (${input.painSeverity})`,
      legalBasis: "المادة 11 من ظهير 1984"
    });
    total += painAmount;
  }

  // 5. Disfigurement
  const disfigurementMap: Record<string, number> = { light: 0.02, important: 0.05, very_important: 0.08 };
  if (input.disfigurementSeverity !== 'none' && disfigurementMap[input.disfigurementSeverity]) {
    const disfigurementAmount = capital * disfigurementMap[input.disfigurementSeverity];
    breakdown.push({
      category: "التعويض عن تشويه الخلقة",
      amount: Math.round(disfigurementAmount),
      details: `تقدير بناء على درجة التشويه (${input.disfigurementSeverity})`,
      legalBasis: "المادة 12 من ظهير 1984"
    });
    total += disfigurementAmount;
  }

  // 6. Career Impact
  if (input.careerImpact !== 'none') {
    const impactAmount = capital * 0.10; // Base 10% for impact
    breakdown.push({
      category: "التعويض عن الآثار المهنية",
      amount: Math.round(impactAmount),
      details: "تعويض عن فقدان أهلية الترقي أو الحرمان من أعمال إضافية",
      legalBasis: "المادة 9 من ظهير 1984"
    });
    total += impactAmount;
  }

  return {
    total: Math.round(total),
    breakdown,
    summary: `تم حساب هذا التعويض بناءً على القواعد المحلية لظهير 1984. تم اعتماد أجر سنوي قدره ${annualIncome} درهم ومعامل سن ${ageCoeff} بناءً على عمر المصاب (${input.age} سنة).`
  };
}
