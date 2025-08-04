import { set } from "react-hook-form";

export default async function generateReceiptPDF (receiptData) {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URL}generate-receipt-pdf/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(receiptData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const urlBlob = URL.createObjectURL(blob);

    // open PDF in a new window tab
    window.open(urlBlob, '_blank');


    //Download PDF
    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = `recouverement.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(urlBlob);
    }, 1000);

  } catch (error) {
    console.error("Error generating receipt PDF:", error);
  }
}