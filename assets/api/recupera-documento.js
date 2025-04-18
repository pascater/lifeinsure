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

// async function downloadDocumentFromAPI(
//   documentId,
//   referenceNumber,
//   filename = "documento.pdf"
// ) {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/document_pointer/${documentId}`
//     );

//     if (!response.ok) {
//       throw new Error("Errore durante il download del documento");
//     }

//     const blob = await response.blob();
//     const blobUrl = URL.createObjectURL(blob);

//     // Створити <a> елемент і завантажити
//     const link = document.createElement("a");
//     link.href = blobUrl;
//     link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     URL.revokeObjectURL(blobUrl);

//     return true;
//   } catch (error) {
//     console.error("❌ Errore durante il download:", error);
//     alert("Impossibile scaricare il documento.");
//     return false;
//   }
// }

async function loadDocumentFromAPI(
  documentId,
  referenceNumber,
  filename = "documento.pdf"
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/document_pointer/${documentId}`
    );

    if (!response.ok) {
      throw new Error("Errore durante il download del documento");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // Показ у модальному вікні
    // const documentModalLabel = document.getElementById("documentModalLabel");
    // const documentContent = document.getElementById("document-content");
    // const modalDownloadBtn = document.getElementById("modal-download-btn");

    // documentModalLabel.textContent = filename;
    // documentContent.innerHTML = `<iframe src="${blobUrl}" style="width:100%; height:80vh;" frameborder="0"></iframe>`;

    // modalDownloadBtn.disabled = false;
    // modalDownloadBtn.innerHTML = '<i class="bi bi-download"></i> Scarica';
    // modalDownloadBtn.onclick = function () {
    //   const link = document.createElement("a");
    //   link.href = blobUrl;
    //   link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    //   URL.revokeObjectURL(blobUrl);
    // };

    // const documentModal = new bootstrap.Modal(
    //   document.getElementById("documentModal")
    // );
    // documentModal.show();

    return blobUrl;
  } catch (error) {
    console.error("❌ Errore durante il download:", error);
    alert("Impossibile scaricare o visualizzare il documento.");
    return false;
  }
}
