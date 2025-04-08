const API_BASE_URL = "https://test-mobirise-api.fly.dev";

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

async function calcolaPremio(dati) {
  console.log("Funzione calcolaPremio chiamata con dati:", dati);
  try {
    await testConnectionToAPI();
    const dataNascita = new Date(dati.dataNascita);
    const birthdate = parseInt(
      dataNascita.getFullYear().toString() +
        (dataNascita.getMonth() + 1).toString().padStart(2, "0") +
        dataNascita.getDate().toString().padStart(2, "0")
    );

    const oggi = new Date();
    const origin = parseInt(
      oggi.getFullYear().toString() +
        (oggi.getMonth() + 1).toString().padStart(2, "0") +
        oggi.getDate().toString().padStart(2, "0")
    );

    const datiAPI = {
      origin: origin,
      birthdate: birthdate,
      smoker: dati.fumatore,
      duration: Number(
        parseInt(
          dati.durata_select === "custom"
            ? dati.durata_custom
            : dati.durata_select
        )
      ),
      coverage: Number(dati.copertura),
    };

    if (dati.altezza) {
      datiAPI.height = Number(dati.altezza);
    }

    if (dati.peso) {
      datiAPI.weight = Number(dati.peso);
    }
    console.log(datiAPI);
    // console.log("Tentativo di chiamata fetch...");
    const risposta = await fetch(`${API_BASE_URL}/premium`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datiAPI),
    });

    if (!risposta.ok) {
      const erroreRisposta = await risposta.text();
      console.error("Errore API:", risposta.status, erroreRisposta);
      return {
        errore: `Errore dal server API (${risposta.status}): ${erroreRisposta}`,
      };
    }
    const datiRisposta = await risposta.json();
    return datiRisposta;
  } catch (errore) {
    console.error("Errore nel calcolo del premio:", errore);
    return {
      errore: `Si è verificato un errore durante la chiamata all'API: ${errore.message}`,
    };
  }
}

async function richiediOfferta(dati) {
  console.log(dati);

  try {
    const datiOfferta = {
      id: crypto.randomUUID(),
      holder: {
        firstname: dati.firstname,
        lastname: dati.lastname,
        street: dati.street,
        zip: dati.zip,
        city: dati.city,
        country: dati.country,
        // nationality: dati.nationality || "CH",
        email: dati.email,
        birthdate: Number(dati.birthdate.replace(/-/g, "")),
        phone: dati.phone || "",
        profession: dati.profession,
        gender: dati.gender,
        // language: dati.nationality || "en-gb",
      },
      beneficiaries: {
        type: dati.beneficiary_type,
        comment: "",
        individual_beneficiaries: [],
      },
      policy_information: {
        tariff: "protection_retail",
        origin: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
        duration: Number(
          parseInt(
            dati["durata-select"] === "custom"
              ? dati["durata-custom"]
              : dati["durata-select"]
          )
        ),
        coverage: parseInt(dati.coverage),
        accident_coverage: 0, //sempre 0?
        general_condition: 20201101, //? sempre 20201101?
        mode: dati.mode,
        smoker: dati.smoker === "no" ? false : true,
        height: Number(parseInt(dati.height)),
        weight: Number(parseInt(dati.weight)),
        comment: dati.notes || "",
      },
      payment_type: dati.payment_type,
      "health questions": [
        ...dati.health_questions.map((item) => {
          return {
            "single health question": {
              type: "health",
              text: `Negli ultimi 5 anni, hai sofferto di ${item.name}?`,
              comment: "",
              answer: item.checked || false,
            },
          };
        }),
        ...dati.health_questions_new.map((item) => {
          return {
            "single health question": {
              type: "health",
              text: item.question,
              comment: item.comment,
              answer: item.answer,
            },
          };
        }),
      ],

      "other underwriting": {
        "privacy questions": [
          ...dati.privacy_questions.map((item) => {
            return {
              "single privacy question": {
                type: "assicurazioni",
                text: item.question,
                comment: item.comment,
                answer: item.answer,
              },
            };
          }),
        ],
      },

      // acquisitionAgent: "lifeInsureBroker",
    };

    if (dati.beneficiary_type === "custom") {
      datiOfferta.beneficiaries.individual_beneficiaries = [
        {
          individual_type: "person",
          percentage: 0.2,
          insured_relationship: dati.beneficiary_relation,
          beneficiary_person: {
            beneficiary_firstname: dati.beneficiary_firstname,
            beneficiary_lastname: dati.beneficiary_lastname,
          },
        },
      ];
    }

    console.log("datiOfferta>>", datiOfferta);

    // Effettua la chiamata API
    const risposta = await fetch(`${API_BASE_URL}/offer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datiOfferta),
    });

    console.log(document.getElementById("reference-number"));
    sessionStorage.setItem("reference-number", datiOfferta.id);
    document.getElementById("reference-number").textContent = datiOfferta.id;

    return await risposta.json();
  } catch (errore) {
    console.error("Errore nella richiesta dell'offerta:", errore);
    return { errore };
  }
}

// Funzione per emettere una polizza
async function emettiPolizza(id) {
  try {
    const datiEmissione = {
      id: id,
    };

    const risposta = await fetch(`${API_BASE_URL}/application`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datiEmissione),
    });

    // if (!risposta.ok) {
    //   throw new Error("Errore nell'emissione della polizza");
    // }

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

document.addEventListener("DOMContentLoaded", function () {
  console.log("API handler caricato. Esecuzione test connessione...");
  testConnectionToAPI();
});
