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

  if (document.getElementById("existing_insurance_yes")) {
    addHealthQuestion(
      document.getElementById("existing_insurance_legend").textContent,
      document.getElementById("existing_insurance_yes").checked,
      `Copertura totale esistente (CHF): ${
        document.getElementById("existing_coverage").value || "non specificato"
      }`
    );
  }

  if (document.getElementById("smoker_yes")) {
    addHealthQuestion(
      document.getElementById("smoker_legend").textContent,
      document.getElementById("smoker_yes").checked
    );
  }

  if (document.getElementById("medication_yes")) {
    addHealthQuestion(
      document.getElementById("medication_legend").textContent,
      document.getElementById("medication_yes").checked
    );

    addHealthQuestion(
      document.getElementById("medication_resolved_legend").textContent,
      document.getElementById("medication_resolved_yes").checked,
      `Riguardo alla domanda: ${
        document.getElementById("medication_legend").textContent
      }. Comment: ${
        document.getElementById("medication_description").value || ""
      }`
    );
  }

  if (document.getElementById("hypertension_yes")) {
    addHealthQuestion(
      document.getElementById("hypertension_legend").textContent,
      document.getElementById("hypertension_yes").checked
    );
  }

  if (document.getElementById("hospitalization_yes")) {
    addHealthQuestion(
      document.getElementById("hospitalization_legend").textContent,
      document.getElementById("hospitalization_yes").checked
    );
    addHealthQuestion(
      document.getElementById("hospitalization_resolved_legend").textContent,
      document.getElementById("hospitalization_resolved_yes").checked,
      `Riguardo alla domanda: ${
        document.getElementById("hospitalization_legend").textContent
      }`
    );
  }

  if (document.getElementById("planned_exam_yes")) {
    addHealthQuestion(
      document.getElementById("planned_exam_legend").textContent,
      document.getElementById("planned_exam_yes").checked
    );
  }

  if (document.getElementById("drugs_yes")) {
    addHealthQuestion(
      document.getElementById("drugs_legend").textContent,
      document.getElementById("drugs_yes").checked
    );
  }

  if (document.getElementById("hiv_yes")) {
    addHealthQuestion(
      document.getElementById("hiv_legend").textContent,
      document.getElementById("hiv_yes").checked
    );
  }

  if (document.getElementById("foreign_stay_yes")) {
    addHealthQuestion(
      document.getElementById("foreign_stay_legend").textContent,
      document.getElementById("foreign_stay_yes").checked
    );
  }

  if (document.getElementById("dangerous_hobby_yes")) {
    addHealthQuestion(
      document.getElementById("dangerous_hobby_legend").textContent,
      document.getElementById("dangerous_hobby_yes").checked
    );
  }

  if (document.getElementById("pension_yes")) {
    addHealthQuestion(
      document.getElementById("pension_legend").textContent,
      document.getElementById("pension_yes").checked
    );
  }
  if (document.getElementById("work_absence_yes")) {
    addHealthQuestion(
      document.getElementById("work_absence_legend").textContent,
      document.getElementById("work_absence_yes").checked
    );
    addHealthQuestion(
      document.getElementById("work_absence_resolved_legend").textContent,
      document.getElementById("work_absence_resolved_yes").checked,
      `Riguardo alla domanda: ${
        document.getElementById("work_absence_legend").textContent
      } `
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

  console.log("form values>>", values);
  return values;
}

async function richiediOfferta(formOfertaData, requiresManualVerification) {
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
        nationality: dati.nationality || "CH",
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
        {
          "single health question": {
            type: "health",
            text:
              document.getElementById("condition_notes_label").textContent ||
              "",
            comment: document.getElementById("condition_notes").value || "",
            answer: document.getElementById("condition_notes").value
              ? true
              : false,
          },
        },
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
      const beneficiaries = Array.from(
        document.querySelectorAll(".beneficiary-container")
      );
      console.log(beneficiaries);

      beneficiaries.map((item) => {
        const firstname = item.querySelector(
          "[data-beneficiary-firstname]"
        ).value;
        const lastname = item.querySelector(
          "[data-beneficiary-lastname]"
        ).value;
        const relation = item.querySelector(
          "[data-beneficiary-relation]"
        ).value;
        const percentage = item.querySelector(
          "[data-beneficiary-percentage]"
        ).value;

        console.log("benef", {
          firstname,
          lastname,
          relation,
          percentage,
        });

        datiOfferta.beneficiaries.individual_beneficiaries.push({
          individual_type: "person",
          percentage: parseInt(percentage) / 100,
          insured_relationship: relation,
          beneficiary_person: {
            beneficiary_firstname: firstname,
            beneficiary_lastname: lastname,
          },
        });
      });
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

    const conditionNotes = document.getElementById("condition_notes");

    console.log("conditionNotes>>", conditionNotes);

    if (risposta.status === 200 && !requiresManualVerification) {
      sessionStorage.removeItem("datiPreventivo");
      const sendDocument = await fetch(`${API_BASE_URL}/send_documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: datiOfferta.id,
          email: datiOfferta.holder.email,
          documentsPointer: datiRisposta.document_pointers,
        }),
      });
      console.log("sendDocument>>", sendDocument);
      const sendDocumentResponse = await sendDocument.json();
      console.log("sendDocumentResponse>>", sendDocumentResponse);
    }

    sessionStorage.setItem("reference-number", datiOfferta.id);
    document.getElementById("reference-number").textContent = datiOfferta.id;
    return { id: datiOfferta.id, ...datiRisposta };
  } catch (errore) {
    console.error("Errore nella richiesta dell'offerta:", errore);
    return { errore };
  }
}
