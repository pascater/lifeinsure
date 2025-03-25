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
      duration: parseInt(dati.durata),
      coverage: parseInt(dati.copertura),
    };

    if (dati.altezza) {
      datiAPI.height = parseInt(dati.altezza);
    }

    if (dati.peso) {
      datiAPI.weight = parseInt(dati.peso);
    }

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
    // Prepara i dati per l'API (esempio semplificato)
    const datiOfferta = {
      id: crypto.randomUUID(),
      holder: {
        firstname: dati.firstname,
        lastname: dati.lastname,
        street: dati.street,
        zip: dati.zip,
        city: dati.city,
        country: dati.country,
        email: dati.email,
        birthdate: Number(dati.birthdate.replace(/-/g, "")),
        profession: dati.profession,
        gender: dati.gender,
        phone: dati.phone || "",
        language: dati.nationality || "en-gb", //optional
      },
      beneficiaries: {
        type: dati.beneficiary_type, //individual custom ==> beneficiary_firstname beneficiary_lastname beneficiary_relation
        comment: "",
      },
      policy_information: {
        tariff: "protection_retail", // sempre protection_retail ?
        origin: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
        duration: parseInt(dati.duration),
        coverage: parseInt(dati.coverage),
        accident_coverage: 0, //sempre 0?
        general_condition: 20201101, //? sempre 20201101?
        mode: dati.mode,
        smoker: dati.smoker ? true : false,
        height: parseInt(dati.height),
        weight: parseInt(dati.weight),
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
      ],

      "other underwriting": {
        "privacy questions": [],
      },
      // acquisitionAgent: "lifeInsureBroker",
    };
    if (dati.existing_insurance === "yes") {
      datiOfferta["health questions"].push({
        "single health question": {
          type: "health",
          text: `Hai già altre assicurazioni sulla vita?`,
          comment: `Copertura totale esistente (CHF): ${dati.existing_coverage}`,
          answer: dati.existing_insurance === "yes" ? true : false,
        },
      });
    }
    if (dati.work_absence === "yes") {
      datiOfferta["health questions"].push({
        "single health question": {
          type: "health",
          text: "Negli ultimi 5 anni, hai avuto assenze dal lavoro di oltre un mese per malattia?",
          comment: "",
          answer: dati.work_absence === "yes" ? true : false,
        },
      });
      datiOfferta["health questions"].push({
        "single health question": {
          type: "health",
          text: "La condizione è risolta da almeno 2 anni senza trattamenti?",
          comment: "",
          answer: dati.work_absence_resolved === "yes" ? true : false,
        },
      });
    }
    // existing_coverage:"222"
    // existing_insurance:"yes"
    // work_absence:"no"
    // work_absence_resolved:"no"
    if (
      dati.beneficiary_type === "individual" ||
      dati.beneficiary_type === "custom"
    ) {
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

    console.log("datiOffertatt", datiOfferta);

    // Effettua la chiamata API
    const risposta = await fetch(`${API_BASE_URL}/offer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datiOfferta),
    });

    // if (!risposta.ok) {
    //   throw new Error("Errore nella richiesta dell'offerta");
    // }

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

    if (!risposta.ok) {
      throw new Error("Errore nell'emissione della polizza");
    }

    return await risposta.json();
  } catch (errore) {
    console.error("Errore nell'emissione della polizza:", errore);
    return { errore: errore.message };
  }
}

// Funzione per recuperare un documento
function recuperaDocumento(documentPointer) {
  return `${API_BASE_URL}/document_pointer/${documentPointer}`;
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("API handler caricato. Esecuzione test connessione...");
  testConnectionToAPI();
});
