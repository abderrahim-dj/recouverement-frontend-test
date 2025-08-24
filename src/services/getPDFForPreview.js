export default async function getPDFForPreview(companyId,) {
  try {

    const url = `${import.meta.env.VITE_BACKEND_URL}company-info/recu-pdf/${companyId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch PDF for preview');
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    return pdfUrl;

  } catch (error) {
    console.error('Error fetching PDF for preview:', error);
    throw error; // Re-throw the error to be handled by the caller
    
  }

}
