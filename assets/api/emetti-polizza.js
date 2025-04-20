async function sendPolizzaByMail(pointers, id, email) {
  try {
    const risposta = await fetch(`${API_BASE_URL}/send_documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pointers, id, email }),
    });
    const rispostaInvio = await risposta.json();
    console.log("Risposta invio email:", rispostaInvio);

    return rispostaInvio;
  } catch (errore) {
    console.error("Errore", errore);
    return { errore: errore.message };
  }
}

async function emettiPolizza(id, email) {
  try {
    const risposta = await fetch(`${API_BASE_URL}/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, email }),
    });
    const rispostaEmetti = await risposta.json();
    await sendPolizzaByMail(rispostaEmetti.document_pointers, id, email);

    return rispostaEmetti;
  } catch (errore) {
    console.error("Errore nell'emissione della polizza:", errore);
    return { errore: errore.message };
  }
}
