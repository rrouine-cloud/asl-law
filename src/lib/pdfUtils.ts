import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPdf(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Inject temporary style to override oklch colors and improve PDF design
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
    #${elementId} {
      background-color: white !important;
      padding: 40px !important;
      font-family: 'Amiri', serif !important;
      color: #1e293b !important;
    }
    #${elementId} * {
      color: #1e293b !important;
      background-color: transparent !important;
      border-color: #e2e8f0 !important;
    }
    #${elementId} h3, #${elementId} h4 {
      color: #be185d !important;
      font-weight: 700 !important;
    }
    .app-name {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #be185d !important;
      border-bottom: 2px solid #be185d;
      padding-bottom: 10px;
    }
  `;
  document.head.appendChild(style);

  // Add app name element
  const appName = document.createElement('div');
  appName.className = 'app-name';
  appName.innerText = 'تطبيق اسأل القانون';
  element.prepend(appName);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Inject a global override style into the cloned document to safely replace all oklch/oklab colors
          const overrideStyle = clonedDoc.createElement('style');
          overrideStyle.innerText = `
            * {
              color: inherit !important;
              background-color: transparent !important;
              border-color: #e2e8f0 !important;
              box-shadow: none !important;
              text-shadow: none !important;
              backdrop-filter: none !important;
            }
            #${elementId} {
              background-color: white !important;
              color: #1e293b !important;
            }
            /* Target problematic tailwind colors that might use oklch */
            [class*="bg-"], [class*="text-"], [class*="border-"] {
                background-color: transparent !important;
                color: #1e293b !important;
            }
            .app-name {
              color: #be185d !important;
              text-align: center !important;
              font-size: 24px !important;
              margin-bottom: 20px !important;
            }
          `;
          clonedDoc.head.appendChild(overrideStyle);

          // Force standard colors on all elements in the clone to avoid oklab/oklch errors
          const allElements = clonedElement.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (el.style) {
              const styles = window.getComputedStyle(el);
              // If we find oklch/oklab in any of these, force a fallback
              if (styles.color.includes('oklch') || styles.color.includes('oklab')) el.style.color = '#1e293b';
              if (styles.backgroundColor.includes('oklch') || styles.backgroundColor.includes('oklab')) el.style.backgroundColor = 'transparent';
              if (styles.borderColor.includes('oklch') || styles.borderColor.includes('oklab')) el.style.borderColor = '#e2e8f0';
            }
          }
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    element.removeChild(appName);
    document.head.removeChild(style);
  }
}
