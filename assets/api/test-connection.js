const API_BASE_URL = "https://lifeinsure2.fly.dev";

async function testConnectionToAPI() {
  try {
    console.log("Tentativo di test connessione API...");
    const testResponse = await fetch(`${API_BASE_URL}/test`, {
      method: "GET",
    });
    console.log("Test di connessione riuscito:", testResponse.status);
    return true;
  } catch (error) {
    console.error("Test di connessione fallito:", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("API handler caricato. Esecuzione test connessione...");
  testConnectionToAPI();
});
