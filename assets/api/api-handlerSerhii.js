// Funzione per emettere una polizza
async function emettiPolizza(id, email) {
  try {
    const risposta = await fetch(`${API_BASE_URL}/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email }),
    });

    return await risposta.json();
  } catch (errore) {
    console.error("Errore nell'emissione della polizza:", errore);
    return { errore: errore.message };
  }
}

// Funzione per recuperare un documento

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
