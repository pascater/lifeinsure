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
