async function recuperaDocumento(pointer, filename = "documento.pdf") {
  try {
    const response = await fetch(`${API_BASE_URL}/document_pointer/${pointer}`);

    if (!response.ok) {
      throw new Error("Errore durante il download");
    }

    const blob = await response.blob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error(err);
    alert("❌ Impossibile scaricare il documento.");
  }
}

async function loadDocumentFromAPI(documentId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/document_pointer/${documentId}`
    );

    if (!response.ok) {
      throw new Error("Errore durante il download del documento");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
  } catch (error) {
    console.error("❌ Errore durante il download:", error);
    alert("Impossibile scaricare o visualizzare il documento.");
    return false;
  }
}
