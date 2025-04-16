function getFormData(form) {
  let values = Object.fromEntries(form.entries());

  values.health_questions = [
    document.getElementById("heart_disease"),
    document.getElementById("stroke"),
    document.getElementById("diabetes"),
    document.getElementById("cancer"),
    document.getElementById("respiratory"),
    document.getElementById("liver"),
    document.getElementById("kidney"),
    document.getElementById("epilepsy"),
    document.getElementById("multiple_sclerosis"),
    document.getElementById("mental_health"),
  ];
  values.health_questions_new = [];
  function addHealthQuestion(question, answer, comment = "") {
    values.health_questions_new.push({
      question,
      answer,
      comment,
    });
  }

  if (document.getElementById("existing_insurance_yes").checked) {
    addHealthQuestion(
      document.getElementById("existing_insurance_label").textContent,
      true,
      `Copertura totale esistente (CHF): ${
        document.getElementById("existing_coverage").value || "non specificato"
      }`
    );
  }

  if (document.getElementById("smoker_yes").checked) {
    addHealthQuestion(
      document.getElementById("smoker_yes_lable").textContent,
      true
    );
  }

  if (document.getElementById("medication_yes").checked) {
    addHealthQuestion(
      document.getElementById("medication_yes_label").textContent,
      true
    );

    addHealthQuestion(
      document.getElementById("medication_resolved_label").textContent,
      document.getElementById("medication_resolved_yes").checked ? true : false,
      document.getElementById("medication_description").value || ""
    );
  }

  if (document.getElementById("hypertension_yes").checked) {
    addHealthQuestion(
      document.getElementById("hypertension_yes_label").textContent,
      true
    );
  }

  if (document.getElementById("hospitalization_yes").checked) {
    addHealthQuestion(
      document.getElementById("hospitalization_yes_label").textContent,
      true
    );
    addHealthQuestion(
      document.getElementById("hospitalization_resolved_yes_label").textContent,
      document.getElementById("hospitalization_resolved_yes").checked
    );
  }

  if (document.getElementById("planned_exam_yes").checked) {
    addHealthQuestion(
      document.getElementById("planned_exam_yes").textContent,
      true
    );
  }

  if (document.getElementById("drugs_yes").checked) {
    addHealthQuestion(
      document.getElementById("drugs_yes_label").textContent,
      true
    );
  }

  if (document.getElementById("hiv_yes").checked) {
    addHealthQuestion(
      document.getElementById("hiv_yes_label").textContent,
      true
    );
  }

  if (document.getElementById("foreign_stay_yes").checked) {
    addHealthQuestion(
      document.getElementById("foreign_stay_yes_label").textContent,
      true
    );
  }

  if (document.getElementById("dangerous_hobby_yes").checked) {
    addHealthQuestion(
      document.getElementById("dangerous_hobby_yes_label").textContent,
      true
    );
  }

  if (document.getElementById("pension_yes").checked) {
    addHealthQuestion(
      document.getElementById("pension_yes_label").textContent,
      true
    );
  }

  values.privacy_questions = [
    {
      question: document.getElementById("privacy_consent_label").textContent,
      answer: document.getElementById("privacy_consent").checked,
      comment: "",
    },

    {
      question: document.getElementById("terms_consent_label").textContent,
      answer: document.getElementById("terms_consent").checked,
      comment: "",
    },
    {
      question: document.getElementById("mandate_consent_label").textContent,
      answer: document.getElementById("mandate_consent").checked,
      comment: "",
    },
    {
      question: document.getElementById("marketing_consent_label").textContent,
      answer: document.getElementById("marketing_consent").checked,
      comment: "",
    },
  ];
  // values["durata-custom"] = document.getElementById("durata-custom").value;
  console.log("form values>>", values);
  return values;
}

async function richiediOfferta(formOfertaData) {
  const dati = getFormData(formOfertaData);
  try {
    const datiOfferta = {
      id: crypto.randomUUID(),
      holder: {
        firstname: dati.firstname,
        lastname: dati.lastname,
        street: dati.street,
        zip: dati.zip,
        city: dati.city,
        country: "CH",
        // nationality: dati.nationality || "CH",
        email: dati.email,
        birthdate: Number(dati.birthdate.replace(/-/g, "")),
        phone: dati.phone || "",
        profession: dati.profession,
        gender: dati.gender,
        language: dati.nationality || "en-gb",
      },
      beneficiaries: {
        type: dati.beneficiary_type,
        comment: "",
        individual_beneficiaries: [],
      },
      policy_information: {
        tariff: "protection_retail",
        origin: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
        duration:
          //  Number(
          parseInt(dati.duration),
        // ),
        coverage: parseInt(dati.coverage),
        accident_coverage: 0, //sempre 0?
        general_condition: 20201101, //? sempre 20201101?
        mode: dati.mode,
        smoker: dati.smoker === "no" ? false : true,
        height:
          // Number        (
          parseInt(dati.height),
        // ),
        weight:
          //  Number(
          parseInt(dati.weight),
        // ),
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
    console.log("risposta>>", risposta);
    const datiRisposta = await risposta.json();
    // Controlla se la risposta è ok
    console.log("risposta dati>>", datiRisposta);

    sessionStorage.setItem("reference-number", datiOfferta.id);
    document.getElementById("reference-number").textContent = datiOfferta.id;
    return { id: datiOfferta.id, ...datiRisposta };
  } catch (errore) {
    console.error("Errore nella richiesta dell'offerta:", errore);
    return { errore };
  }
}
