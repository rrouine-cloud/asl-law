
export enum CASE_TYPE {
  CIVIL = "قضايا مدنية",
  SOCIAL = "قضايا اجتماعية",
  COMMERCIAL = "قضايا تجارية",
  ADMINISTRATIVE = "قضايا إدارية",
  FAMILY = "قضايا الأسرة",
  PROXIMITY = "قضاء القرب",
  ELECTION = "منازعات انتخابية",
  TAX = "ضرائب ورسوم",
  EXPROPRIATION = "نزع الملكية",
  PENSIONS = "معاشات ومنح",
  PUBLIC_DEBTS = "تحصيل الديون العمومية",
  ADMIN_LIABILITY = "التعويض عن أعمال القانون العام",
  LABOR_DISPUTE = "نزاعات الشغل والتدريب",
  WORK_ACCIDENT = "حوادث الشغل والأمراض المهنية",
  SOCIAL_SECURITY = "الضمان الاجتماعي",
  COMMERCIAL_CONTRACTS = "العقود التجارية",
  MERCHANT_DISPUTES = "نزاعات بين التجار",
  COMMERCIAL_PAPER = "الأوراق التجارية",
  PARTNER_DISPUTE = "نزاعات الشركاء",
  BUSINESS_ASSET = "الأصول التجارية",
  BUSINESS_DISTRESS = "صعوبات المقاولة",
}

export interface JurisdictionInput {
  caseType: CASE_TYPE;
  value?: number;
  commune?: string;
  isMixedCivilCommercial?: boolean;
  isResidenceOutsideMorocco?: boolean;
  isOutsideMorocco?: boolean;
  isOutsideKnownJurisdiction?: boolean;
}

export interface JurisdictionResult {
  courtType: string;
  specializedDivision?: string;
  isFinal?: boolean;
  legalBasis: string[];
  notes?: string;
}

function finalizeResult(result: JurisdictionResult): JurisdictionResult {
  if (!result.isFinal && !result.legalBasis.includes("المادة 60")) {
    result.legalBasis.push("المادة 60");
  }
  return result;
}

export function determineJurisdiction(input: JurisdictionInput): JurisdictionResult {
  const { caseType, value = 0 } = input;

  // 1. Administrative Jurisdiction (Articles 38, 39, 50, 53, 54, 56)
  const isAdmin = [
    CASE_TYPE.ADMINISTRATIVE,
    CASE_TYPE.ELECTION,
    CASE_TYPE.TAX,
    CASE_TYPE.EXPROPRIATION,
    CASE_TYPE.PENSIONS,
    CASE_TYPE.PUBLIC_DEBTS,
    CASE_TYPE.ADMIN_LIABILITY
  ].includes(caseType);

  if (isAdmin) {
    let basis = ["المادة 38"];
    if (caseType === CASE_TYPE.ELECTION) basis.push("المادة 50");
    if (caseType === CASE_TYPE.TAX) basis.push("المادة 53");
    if (caseType === CASE_TYPE.EXPROPRIATION) basis.push("المادة 54");
    if (caseType === CASE_TYPE.PENSIONS) basis.push("المادة 56");
    if (input.commune === "الرباط" || input.isOutsideKnownJurisdiction) basis.push("المادة 39");

    return finalizeResult({
      courtType: input.isOutsideKnownJurisdiction ? "المحكمة الابتدائية الإدارية بالرباط" : "المحاكم الابتدائية الإدارية أو الأقسام المتخصصة",
      legalBasis: basis,
      isFinal: false,
      notes: input.isOutsideKnownJurisdiction 
        ? "المادة 39: تختص المحكمة الابتدائية الإدارية بالرباط بالنزاعات الناشئة خارج دوائر اختصاص جميع المحاكم الإدارية." 
        : "تختص المحاكم الابتدائية الإدارية أو الأقسام المتخصصة في القضاء الإداري بالبت في هذه النزاعات وفق المادة 38."
    });
  }

  // 2. Commercial Jurisdiction (Articles 31, 35, 37)
  const isCommercial = [
    CASE_TYPE.COMMERCIAL,
    CASE_TYPE.COMMERCIAL_CONTRACTS,
    CASE_TYPE.MERCHANT_DISPUTES,
    CASE_TYPE.COMMERCIAL_PAPER,
    CASE_TYPE.PARTNER_DISPUTE,
    CASE_TYPE.BUSINESS_ASSET,
    CASE_TYPE.BUSINESS_DISTRESS
  ].includes(caseType) || input.isMixedCivilCommercial;

  if (isCommercial) {
    let basis = ["المادة 35"];
    if (input.isMixedCivilCommercial) basis.push("المادة 37");

    // Art 31: Commercial disputes <= 80,000 MAD if no commercial court
    if (value <= 80000 && ![CASE_TYPE.BUSINESS_ASSET, CASE_TYPE.PARTNER_DISPUTE, CASE_TYPE.BUSINESS_DISTRESS].includes(input.caseType)) {
      return finalizeResult({
        courtType: "المحاكم الابتدائية (القسم المتخصص)",
        legalBasis: ["المادة 31"],
        isFinal: value <= 10000,
        notes: "المادة 31: القضايا التجارية التي لا تتجاوز 80,000 درهم تختص بها المحاكم الابتدائية في حال عدم وجود محكمة تجارية."
      });
    }

    return finalizeResult({
      courtType: "المحاكم الابتدائية التجارية أو الأقسام المتخصصة",
      legalBasis: basis,
      isFinal: false,
      notes: "المادة 35: تختص المحاكم الابتدائية التجارية أو الأقسام المتخصصة في القضاء التجاري بالطلبات التي تتجاوز 80,000 درهم أو النزاعات التجارية النوعية."
    });
  }

  // 3. Social and Labor (Article 33)
  const isSocial = [
    CASE_TYPE.SOCIAL,
    CASE_TYPE.LABOR_DISPUTE,
    CASE_TYPE.WORK_ACCIDENT,
    CASE_TYPE.SOCIAL_SECURITY
  ].includes(caseType);

  if (isSocial) {
    let courtType = "المحاكم الابتدائية";
    let notes = "المادة 33: تختص المحاكم الابتدائية بالنزاعات الفردية المتعلقة بعقود الشغل وحوادث الشغل والضمان الاجتماعي.";
    let basis = ["المادة 29", "المادة 33"];

    if (caseType === CASE_TYPE.SOCIAL_SECURITY && input.isResidenceOutsideMorocco) {
      courtType = "محكمة الدار البيضاء";
      basis.push("المادة 68");
      notes = "خلافا للقواعد العامة، المادة 68 تسند الاختصاص لمحكمة الدار البيضاء إذا كان موطن المؤمن له خارج المغرب في دعاوى الضمان الاجتماعي.";
    } else if (caseType === CASE_TYPE.WORK_ACCIDENT && input.isOutsideMorocco) {
      courtType = "محكمة محل إقامة الضحية أو ذوي حقوقه";
      basis.push("المادة 68");
      notes = "المادة 68: في دعاوى حوادث الشغل، المختصة هي محكمة محل إقامة الضحية أو ذوي حقوقه إذا وقعت الحادثة خارج المغرب.";
    } else if (caseType === CASE_TYPE.WORK_ACCIDENT && input.isResidenceOutsideMorocco) {
      courtType = "محكمة محل إيداع التصريح بالمرض";
      basis.push("المادة 68");
      notes = "المادة 68: في دعاوى الأمراض المهنية، المختصة هي محكمة محل إيداع التصريح بالمرض إذا كان موطن الأجير خارج المغرب.";
    }

    // Casablanca Classified Courts
    if (input.commune?.includes("الدار البيضاء")) {
      courtType = "المحكمة الابتدائية الاجتماعية بالدار البيضاء";
    }

    return finalizeResult({
      courtType,
      specializedDivision: "قسم القضايا الاجتماعية",
      legalBasis: basis,
      isFinal: value <= 10000,
      notes
    });
  }

  // 4. Family and Proximity (Article 29)
  if (caseType === CASE_TYPE.FAMILY || caseType === CASE_TYPE.PROXIMITY) {
    let courtType = "المحاكم الابتدائية";
    if (input.commune?.includes("الدار البيضاء")) {
      courtType = caseType === CASE_TYPE.FAMILY 
        ? "المحكمة الابتدائية الاجتماعية بالدار البيضاء" 
        : "المحكمة الابتدائية المدنية بالدار البيضاء";
    }

    return finalizeResult({
      courtType: courtType,
      specializedDivision: caseType === CASE_TYPE.FAMILY ? "قسم قضاء الأسرة" : "قسم قضاء القرب",
      legalBasis: ["المادة 29"],
      isFinal: caseType === CASE_TYPE.PROXIMITY || value <= 10000,
      notes: "المادة 29: تختص المحاكم الابتدائية بقضايا الأسرة وقضايا قضاء القرب."
    });
  }

  // 5. Default Civil (Article 29, 30)
  const isFinal = value <= 10000;
  let courtType = "المحاكم الابتدائية";
  if (input.commune?.includes("الدار البيضاء")) {
    courtType = "المحكمة الابتدائية المدنية بالدار البيضاء";
  }

  return finalizeResult({
    courtType,
    isFinal: isFinal,
    legalBasis: ["المادة 29", "المادة 30"],
    notes: isFinal 
      ? "المادة 30: الطلبات التي قيمتها حتى 10,000 درهم تبت فيها المحاكم الابتدائية ابتدائياً وانتهائياً." 
      : "المادة 30: الطلبات التي تتجاوز قيمتها 10,000 درهم تبت فيها المحاكم الابتدائية ابتدائياً مع حفظ حق الاستئناف."
  });
}
