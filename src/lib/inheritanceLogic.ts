/**
 * Inheritance Logic based on Moroccan Family Code (مدونة الأسرة)
 */

export interface InheritanceInput {
  estateValue: number;
  debts: number;
  will: number;
  deceasedGender: 'male' | 'female';
  isFatherAlive: boolean;
  isMotherAlive: boolean;
  grandfather?: boolean;
  paternalGrandmother?: boolean;
  maternalGrandmother?: boolean;
  isMarried: boolean;
  sonsCount: number;
  daughtersCount: number;
  wivesCount: number; // Only if deceased is male
  husbandPresent: boolean; // Only if deceased is female
  fullBrothersCount: number;
  paternalBrothersCount: number;
  maternalSiblingsCount: number;
  fullSistersCount: number;
  paternalSistersCount: number;
}

export interface HeirResult {
  name: string;
  shareFraction: string;
  amount: number;
  percentage: number;
  legalBasis: string;
  religiousBasis: string;
  religiousSource: string;
  note?: string;
}

export function calculateInheritance(input: InheritanceInput) {
  const {
    estateValue,
    debts,
    will,
    deceasedGender,
    isFatherAlive,
    isMotherAlive,
    grandfather,
    paternalGrandmother,
    maternalGrandmother,
    isMarried,
    sonsCount,
    daughtersCount,
    wivesCount,
    husbandPresent,
    fullBrothersCount,
    paternalBrothersCount,
    maternalSiblingsCount,
    fullSistersCount,
    paternalSistersCount,
  } = input;

  // 1. Initial Deductions (Order: Funeral -> Debts -> Wills -> Inheritance)
  // We assume debts include funeral expenses for simplicity or user provides them together
  const netAfterDebts = estateValue - debts;
  const maxWill = netAfterDebts / 3;
  const actualWill = Math.min(will, maxWill);
  const finalEstate = netAfterDebts - actualWill;

  const results: any[] = [];
  const fixedShares: { [key: string]: number } = {};

  // Helper to check for descendants (الفرع الوارث)
  const hasDescendants = sonsCount > 0 || daughtersCount > 0;
  const hasMaleDescendant = sonsCount > 0;
  
  // Helper to check for multiple siblings (جمع من الإخوة)
  const totalSiblings = fullBrothersCount + paternalBrothersCount + maternalSiblingsCount + fullSistersCount + paternalSistersCount;

  // --- FIXED SHARES (أصحاب الفروض) ---

  // 2. Spouse
  if (isMarried) {
    if (deceasedGender === 'male') {
      const share = hasDescendants ? 1/8 : 1/4;
      const amount = finalEstate * share;
      results.push({
        name: wivesCount > 1 ? `الزوجات (${wivesCount})` : 'الزوجة',
        shareFraction: hasDescendants ? '1/8' : '1/4',
        amount: amount,
        legalBasis: hasDescendants ? 'المادة 344' : 'المادة 343',
        religiousBasis: hasDescendants ? 'فإن كان لكم ولد فلهن الثمن' : 'ولهن الربع مما تركتم إن لم يكن لكم ولد',
        religiousSource: 'سورة النساء، الآية 12',
      });
      fixedShares['spouse'] = share;
    } else if (husbandPresent) {
      const share = hasDescendants ? 1/4 : 1/2;
      const amount = finalEstate * share;
      results.push({
        name: 'الزوج',
        shareFraction: hasDescendants ? '1/4' : '1/2',
        amount: amount,
        legalBasis: hasDescendants ? 'المادة 343' : 'المادة 342',
        religiousBasis: hasDescendants ? 'فإن كان لهن ولد فلكم الربع' : 'ولكم نصف ما ترك أزواجكم إن لم يكن لهن ولد',
        religiousSource: 'سورة النساء، الآية 12',
      });
      fixedShares['spouse'] = share;
    }
  }

  // 3. Mother
  if (isMotherAlive) {
    const share = (hasDescendants || totalSiblings >= 2) ? 1/6 : 1/3;
    fixedShares['mother'] = share;
    results.push({
      name: 'الأم',
      shareFraction: share === 1/6 ? '1/6' : '1/3',
      amount: finalEstate * share,
      legalBasis: share === 1/6 ? 'المادة 347' : 'المادة 346',
      religiousBasis: share === 1/6 ? 'فإن كان له إخوة فلأمه السدس' : 'فإن لم يكن له ولد وورثه أبواه فلأمه الثلث',
      religiousSource: 'سورة النساء، الآية 11',
    });
  } else if (maternalGrandmother) {
    const share = 1/6;
    fixedShares['m_grandmother'] = share;
    results.push({
      name: 'الجدة لأم',
      shareFraction: '1/6',
      amount: finalEstate * share,
      legalBasis: 'المادة 347',
      religiousBasis: 'قضى رسول الله صلى الله عليه وسلم للجدة بالسدس',
      religiousSource: 'سنن أبي داود والترمذي',
    });
  }

  // 4. Father
  if (isFatherAlive) {
    if (hasMaleDescendant) {
      fixedShares['father'] = 1/6;
      results.push({
        name: 'الأب',
        shareFraction: '1/6',
        amount: finalEstate * 1/6,
        legalBasis: 'المادة 347',
        religiousBasis: 'ولأبويه لكل واحد منهما السدس مما ترك إن كان له ولد',
        religiousSource: 'سورة النساء، الآية 11',
      });
    } else if (daughtersCount > 0) {
      fixedShares['father'] = 1/6;
      // Father gets 1/6 + residue later
    }
    // If no descendants, father is pure Ta'sib (handled later)
  } else if (grandfather) {
    if (hasMaleDescendant) {
      fixedShares['grandfather'] = 1/6;
      results.push({
        name: 'الجد لأب',
        shareFraction: '1/6',
        amount: finalEstate * 1/6,
        legalBasis: 'المادة 347',
        religiousBasis: 'الجد بمنزلة الأب عند عدمه',
        religiousSource: 'إجماع الصحابة والفقهاء',
      });
    }
  }

  // 5. Daughters (if no sons)
  if (sonsCount === 0 && daughtersCount > 0) {
    const share = daughtersCount === 1 ? 1/2 : 2/3;
    fixedShares['daughters'] = share;
    results.push({
      name: daughtersCount === 1 ? 'البنت' : `البنات (${daughtersCount})`,
      shareFraction: share === 1/2 ? '1/2' : '2/3',
      amount: finalEstate * share,
      legalBasis: share === 1/2 ? 'المادة 342' : 'المادة 345',
      religiousBasis: share === 1/2 ? 'وإن كانت واحدة فلها النصف' : 'فإن كن نساء فوق اثنتين فلهن ثلثا ما ترك',
      religiousSource: 'سورة النساء، الآية 11',
    });
  }

  // 6. Maternal Siblings
  if (!isFatherAlive && !grandfather && !hasDescendants && maternalSiblingsCount > 0) {
    const share = maternalSiblingsCount === 1 ? 1/6 : 1/3;
    fixedShares['maternal_siblings'] = share;
    results.push({
      name: maternalSiblingsCount === 1 ? 'الأخ/الأخت لأم' : `الإخوة لأم (${maternalSiblingsCount})`,
      shareFraction: share === 1/6 ? '1/6' : '1/3',
      amount: finalEstate * share,
      legalBasis: share === 1/6 ? 'المادة 347' : 'المادة 346',
      religiousBasis: 'وإن كان رجل يورث كلالة أو امرأة وله أخ أو أخت فلكل واحد منهما السدس فإن كانوا أكثر من ذلك فهم شركاء في الثلث',
      religiousSource: 'سورة النساء، الآية 12',
    });
  }

  // --- CALCULATE RESIDUE (العصبة) ---
  
  let totalFixed = 0;
  for (const key in fixedShares) totalFixed += fixedShares[key];

  // Handle Awl (العول)
  if (totalFixed > 1) {
    results.forEach(r => {
      const originalShare = r.amount / finalEstate;
      r.amount = (originalShare / totalFixed) * finalEstate;
      r.note = 'تم تطبيق العول لتزاحم الفروض (زيادة في السهام ونقص في الحصص)';
    });
    
    const finalResults: HeirResult[] = results.map(r => ({
      ...r,
      percentage: (r.amount / finalEstate) * 100
    }));

    return { results: finalResults, finalEstate, actualWill, netAfterDebts, estateValue };
  }

  let residue = finalEstate * (1 - totalFixed);

  // 7. Father's Ta'sib (if daughters only)
  if (isFatherAlive && !hasMaleDescendant && daughtersCount > 0) {
    const tasibAmount = residue;
    results.push({
      name: 'الأب (فرضاً وتعصيباً)',
      shareFraction: '1/6 + الباقي',
      amount: (finalEstate * 1/6) + tasibAmount,
      legalBasis: 'المادة 353',
      religiousBasis: 'ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر',
      religiousSource: 'صحيح البخاري ومسلم',
    });
    residue = 0;
  } else if (isFatherAlive && !hasDescendants) {
    results.push({
      name: 'الأب (تعصيباً)',
      shareFraction: 'الباقي',
      amount: residue,
      legalBasis: 'المادة 349',
      religiousBasis: 'وورثه أبواه فلأمه الثلث (والباقي للأب تعصيباً)',
      religiousSource: 'سورة النساء، الآية 11',
    });
    residue = 0;
  }

  // 8. Children Ta'sib
  if (sonsCount > 0) {
    const totalHeads = (sonsCount * 2) + daughtersCount;
    const perHead = residue / totalHeads;
    
    if (sonsCount > 0) {
      results.push({
        name: `الأبناء (${sonsCount})`,
        shareFraction: 'تعصيباً',
        amount: perHead * 2 * sonsCount,
        legalBasis: 'المادة 349',
        religiousBasis: 'يوصيكم الله في أولادكم للذكر مثل حظ الأنثيين',
        religiousSource: 'سورة النساء، الآية 11',
      });
    }
    if (daughtersCount > 0) {
      results.push({
        name: `البنات (${daughtersCount})`,
        shareFraction: 'تعصيباً مع الغير',
        amount: perHead * daughtersCount,
        legalBasis: 'المادة 351',
        religiousBasis: 'يوصيكم الله في أولادكم للذكر مثل حظ الأنثيين',
        religiousSource: 'سورة النساء، الآية 11',
      });
    }
    residue = 0;
  }

  // 9. Siblings Ta'sib
  if (!hasDescendants && !isFatherAlive && residue > 0) {
    if (fullBrothersCount > 0 || fullSistersCount > 0) {
      const totalHeads = (fullBrothersCount * 2) + fullSistersCount;
      const perHead = residue / totalHeads;
      if (fullBrothersCount > 0) {
        results.push({
          name: `الإخوة الأشقاء (${fullBrothersCount})`,
          shareFraction: 'تعصيباً',
          amount: perHead * 2 * fullBrothersCount,
          legalBasis: 'المادة 349',
          religiousBasis: 'وإن كانوا إخوة رجالاً ونساءً فللذكر مثل حظ الأنثيين',
          religiousSource: 'سورة النساء، الآية 176',
        });
      }
      if (fullSistersCount > 0) {
        results.push({
          name: `الأخوات الشقيقات (${fullSistersCount})`,
          shareFraction: 'تعصيباً بالغير',
          amount: perHead * fullSistersCount,
          legalBasis: 'المادة 351',
          religiousBasis: 'وإن كانوا إخوة رجالاً ونساءً فللذكر مثل حظ الأنثيين',
          religiousSource: 'سورة النساء، الآية 176',
        });
      }
      residue = 0;
    } else if (paternalBrothersCount > 0 || paternalSistersCount > 0) {
      const totalHeads = (paternalBrothersCount * 2) + paternalSistersCount;
      const perHead = residue / totalHeads;
      if (paternalBrothersCount > 0) {
        results.push({
          name: `الإخوة لأب (${paternalBrothersCount})`,
          shareFraction: 'تعصيباً',
          amount: perHead * 2 * paternalBrothersCount,
          legalBasis: 'المادة 349',
          religiousBasis: 'ألحقوا الفرائض بأهلها فما بقي فلأولى رجل ذكر',
          religiousSource: 'صحيح البخاري ومسلم',
        });
      }
      if (paternalSistersCount > 0) {
        results.push({
          name: `الأخوات لأب (${paternalSistersCount})`,
          shareFraction: 'تعصيباً بالغير',
          amount: perHead * paternalSistersCount,
          legalBasis: 'المادة 351',
          religiousBasis: 'للذكر مثل حظ الأنثيين',
          religiousSource: 'سورة النساء، الآية 176',
        });
      }
      residue = 0;
    }
  }

  // 10. Radd (الرد)
  if (residue > 0) {
    const raddHeirs = results.filter(r => !r.name.includes('الزوج'));
    const totalRaddAmount = raddHeirs.reduce((sum, h) => sum + h.amount, 0);
    if (totalRaddAmount > 0) {
      raddHeirs.forEach(h => {
        const ratio = h.amount / totalRaddAmount;
        h.amount += residue * ratio;
        h.note = (h.note || '') + ' تم الرد لعدم وجود عصبة (زيادة في الحصص)';
      });
    } else {
      results.push({
        name: 'بيت المال (الدولة)',
        shareFraction: 'الباقي',
        amount: residue,
        legalBasis: 'المادة 349 (البند 6)',
        religiousBasis: 'إذا لم يكن هناك وارث رد الباقي لبيت المال',
        religiousSource: 'قواعد الفقه المالكي',
      });
    }
  }

  const finalResults: HeirResult[] = results.map(r => ({
    ...r,
    percentage: (r.amount / finalEstate) * 100
  }));

  return { results: finalResults, finalEstate, actualWill, netAfterDebts, estateValue };
}
