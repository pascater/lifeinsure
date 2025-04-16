async function richiediOfferta(dati) {
  console.log("form>>", dati);

  // try {
  //   const datiOfferta = {
  //     id: crypto.randomUUID(),
  //     holder: {
  //       firstname: dati.firstname,
  //       lastname: dati.lastname,
  //       street: dati.street,
  //       zip: dati.zip,
  //       city: dati.city,
  //       country: dati.country,
  //       // nationality: dati.nationality || "CH",
  //       email: dati.email,
  //       birthdate: Number(dati.birthdate.replace(/-/g, "")),
  //       phone: dati.phone || "",
  //       profession: dati.profession,
  //       gender: dati.gender,
  //       language: dati.nationality || "en-gb",
  //     },
  //     beneficiaries: {
  //       type: dati.beneficiary_type,
  //       comment: "",
  //       individual_beneficiaries: [],
  //     },
  //     policy_information: {
  //       tariff: "protection_retail",
  //       origin: Number(new Date().toISOString().slice(0, 10).replace(/-/g, "")),
  //       duration:
  //         //  Number(
  //         parseInt(
  //           dati["durata-select"] === "custom"
  //             ? dati["durata-custom"]
  //             : dati["durata-select"]
  //         ),
  //       // ),
  //       coverage: parseInt(dati.coverage),
  //       accident_coverage: 0, //sempre 0?
  //       general_condition: 20201101, //? sempre 20201101?
  //       mode: dati.mode,
  //       smoker: dati.smoker === "no" ? false : true,
  //       height:
  //         // Number        (
  //         parseInt(dati.height),
  //       // ),
  //       weight:
  //         //  Number(
  //         parseInt(dati.weight),
  //       // ),
  //       comment: dati.notes || "",
  //     },
  //     payment_type: dati.payment_type,
  //     "health questions": [
  //       ...dati.health_questions.map((item) => {
  //         return {
  //           "single health question": {
  //             type: "health",
  //             text: `Negli ultimi 5 anni, hai sofferto di ${item.name}?`,
  //             comment: "",
  //             answer: item.checked || false,
  //           },
  //         };
  //       }),
  //       ...dati.health_questions_new.map((item) => {
  //         return {
  //           "single health question": {
  //             type: "health",
  //             text: item.question,
  //             comment: item.comment,
  //             answer: item.answer,
  //           },
  //         };
  //       }),
  //     ],

  //     "other underwriting": {
  //       "privacy questions": [
  //         ...dati.privacy_questions.map((item) => {
  //           return {
  //             "single privacy question": {
  //               type: "assicurazioni",
  //               text: item.question,
  //               comment: item.comment,
  //               answer: item.answer,
  //             },
  //           };
  //         }),
  //       ],
  //     },

  //     // acquisitionAgent: "lifeInsureBroker",
  //   };

  //   if (dati.beneficiary_type === "custom") {
  //     datiOfferta.beneficiaries.individual_beneficiaries = [
  //       {
  //         individual_type: "person",
  //         percentage: 0.2,
  //         insured_relationship: dati.beneficiary_relation,
  //         beneficiary_person: {
  //           beneficiary_firstname: dati.beneficiary_firstname,
  //           beneficiary_lastname: dati.beneficiary_lastname,
  //         },
  //       },
  //     ];
  //   }

  //   console.log("datiOfferta>>", datiOfferta);

  //   // Effettua la chiamata API
  //   // const risposta = await fetch(`${API_BASE_URL}/offer`, {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //   },
  //   //   body: JSON.stringify(datiOfferta),
  //   // });

  //   sessionStorage.setItem("reference-number", datiOfferta.id);
  //   document.getElementById("reference-number").textContent = datiOfferta.id;

  //   return await { risposta, datiOfferta };
  // } catch (errore) {
  //   console.error("Errore nella richiesta dell'offerta:", errore);
  //   return { errore };
  // }
}
