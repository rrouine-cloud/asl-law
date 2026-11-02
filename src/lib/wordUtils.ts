import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

interface EntitlementBreakdown {
  category: string;
  amount: number;
  details: string;
  legalBasis: string;
}

export async function exportToWord(result: { total: number, monthlyTotal?: number, breakdown: EntitlementBreakdown[], summary: string, legalAdvice: string }, formData: any) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: "تقرير تقدير مستحقات الطلاق",
                bold: true,
                size: 40, 
                font: "Traditional Arabic",
                color: "c2185b",
              }),
            ],
            alignment: AlignmentType.RIGHT,
            bidirectional: true,
            spacing: { after: 300 },
          }),

          // Case summary
          new Paragraph({
            children: [
              new TextRun({ text: "ملخص معطيات الحالة:", bold: true, size: 32, font: "Traditional Arabic", underline: {} }),
            ],
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),

          new Table({
            alignment: AlignmentType.RIGHT,
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                   new TableCell({ 
                     children: [
                       new Paragraph({ 
                         children: [
                           new TextRun({ 
                             text: `${formData.marriageDuration} سنة${formData.marriageDurationMonths && formData.marriageDurationMonths !== '0' ? ` و ${formData.marriageDurationMonths} شهر` : ''}`, 
                             font: "Arial", 
                             size: 32 
                           })
                         ], 
                         alignment: AlignmentType.RIGHT, 
                         bidirectional: true 
                       })
                     ] 
                   }),
                   new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "مدة الزواج", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] }),
                ]
              }),
              new TableRow({
                children: [
                   new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(formData.childrenCount), font: "Arial", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] }),
                   new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "عدد الأطفال", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] }),
                ]
              }),
              new TableRow({
                children: [
                   new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: formData.socialClass === 'rich' ? 'ميسورة' : formData.socialClass === 'middle' ? 'متوسطة' : 'محدودة', font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] }),
                   new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "المستوى الاجتماعي", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] }),
                ]
              }),
            ]
          }),

          // Entitlements Section
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "المستحقات المالية المقدرة:", bold: true, size: 32, font: "Traditional Arabic" }),
            ],
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),
          
          new Table({
            alignment: AlignmentType.RIGHT,
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ 
                    shading: { fill: "fce4ec" },
                    children: [new Paragraph({ children: [new TextRun({ text: "المبلغ", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.CENTER, bidirectional: true })] 
                  }),
                  new TableCell({ 
                    shading: { fill: "fce4ec" },
                    children: [new Paragraph({ children: [new TextRun({ text: "نوع التعويض", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.CENTER, bidirectional: true })] 
                  }),
                ],
              }),
              ...result.breakdown.map(item => new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: Math.round(item.amount).toString(), alignment: AlignmentType.CENTER, bidirectional: true })] }),
                  new TableCell({ children: [new Paragraph({ text: item.category, alignment: AlignmentType.RIGHT, bidirectional: true })] }),
                ],
              })),
              new TableRow({
                children: [
                  new TableCell({ 
                    shading: { fill: "E6FFE6" },
                    children: [new Paragraph({ children: [new TextRun({ text: Math.round(result.total).toString(), bold: true, font: "Arial", size: 32 })], alignment: AlignmentType.CENTER, bidirectional: true })] 
                  }),
                  new TableCell({ 
                    shading: { fill: "E6FFE6" },
                    children: [new Paragraph({ children: [new TextRun({ text: "مجموع الدفعات الفورية (مرة واحدة)", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] 
                  }),
                ],
              }),
              ...(result.monthlyTotal ? [
                new TableRow({
                  children: [
                    new TableCell({ 
                      shading: { fill: "fff1f2" },
                      children: [new Paragraph({ children: [new TextRun({ text: Math.round(result.monthlyTotal).toString(), bold: true, font: "Arial", size: 32 })], alignment: AlignmentType.CENTER, bidirectional: true })] 
                    }),
                    new TableCell({ 
                      shading: { fill: "fff1f2" },
                      children: [new Paragraph({ children: [new TextRun({ text: "الراتب الشهري المتوقع (نفقة)", bold: true, font: "Traditional Arabic", size: 32 })], alignment: AlignmentType.RIGHT, bidirectional: true })] 
                    }),
                  ],
                })
              ] : []),
            ],
          }),
          
          // Summary text
          new Paragraph({ text: "", spacing: { before: 400 } }),
          new Paragraph({
            children: [new TextRun({ text: "الخلاصة:", bold: true, size: 32, font: "Traditional Arabic" })],
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: result.summary, font: "Traditional Arabic", size: 32 })],
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { after: 300, line: 360 },
          }),

          // Disclaimer Footer
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: "DDDDDD" } },
            children: [
              new TextRun({ 
                text: "تنبيه: هذا التقرير استرشادي ولا يعوض قرار المحكمة الرسمي. التقديرات تظل تقريبية وتخضع للسلطة التقديرية للقضاء.", 
                italics: true, 
                color: "888888",
                size: 28,
                font: "Traditional Arabic"
              }),
            ],
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `تقرير_تقدير_المستحقات_${new Date().toLocaleDateString('ar-EG')}.docx`);
}
