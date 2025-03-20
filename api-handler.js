// Configurazione API
const API_KEY = 'yra9qc9WffYaEsKlib8IrQwc2GRLdUCEJIzOo4uTfyc';
const API_BASE_URL = 'https://squarelifetest.asp.lifeware.ch';

// Funzione per calcolare il premio
async function calcolaPremio(dati) {
    try {
        // Converti la data di nascita nel formato richiesto (YYYYMMDD)
        const dataNascita = dati.dataNascita.replace(/-/g, '');
        
        // Prepara i dati per l'API
        const datiAPI = {
            origin: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
            birthdate: dataNascita,
            smoker: dati.fumatore,
            duration: parseInt(dati.durata),
            coverage: parseInt(dati.copertura)
        };
        
        // Aggiungi altezza e peso se disponibili
        if (dati.altezza) datiAPI.height = parseInt(dati.altezza);
        if (dati.peso) datiAPI.weight = parseInt(dati.peso);
        
        // Effettua la chiamata API
        const risposta = await fetch(`${API_BASE_URL}/squarelife_protection/api/v0/switzerland/life_insurance/premium`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SQUARELIFE-APIKEY': API_KEY
            },
            body: JSON.stringify(datiAPI)
        });
        
        // Controlla se la risposta è valida
        if (!risposta.ok) {
            throw new Error('Errore nella richiesta del premio');
        }
        
        // Restituisci i dati elaborati
        return await risposta.json();
        
    } catch (errore) {
        console.error('Errore nel calcolo del premio:', errore);
        return { errore: errore.message };
    }
}

// Funzione per richiedere un'offerta
async function richiediOfferta(dati) {
    try {
        // Prepara i dati per l'API (esempio semplificato)
        const datiOfferta = {
            id: dati.id,
            holder: {
                firstname: dati.nome,
                lastname: dati.cognome,
                street: dati.indirizzo,
                zip: dati.cap,
                city: dati.citta,
                country: dati.paese,
                email: dati.email,
                birthdate: dati.dataNascita.replace(/-/g, ''),
                profession: dati.professione,
                gender: dati.genere
            },
            beneficiaries: {
                type: "legal"
            },
            policy_information: {
                tariff: "protection_retail",
                origin: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
                duration: parseInt(dati.durata),
                coverage: parseInt(dati.copertura),
                accident_coverage: 0,
                general_condition: 20201101,
                mode: dati.modalitaPagamento || "annual",
                smoker: dati.fumatore,
                height: parseInt(dati.altezza),
                weight: parseInt(dati.peso)
            },
            payment_type: "invoice_esr",
            health_questions: [],
            other_underwriting: {
                privacy_questions: []
            }
        };
        
        // Effettua la chiamata API
        const risposta = await fetch(`${API_BASE_URL}/squarelife_protection/api/v0/switzerland/life_insurance/offer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SQUARELIFE-APIKEY': API_KEY
            },
            body: JSON.stringify(datiOfferta)
        });
        
        if (!risposta.ok) {
            throw new Error('Errore nella richiesta dell\'offerta');
        }
        
        return await risposta.json();
        
    } catch (errore) {
        console.error('Errore nella richiesta dell\'offerta:', errore);
        return { errore: errore.message };
    }
}

// Funzione per emettere una polizza
async function emettiPolizza(id) {
    try {
        const datiEmissione = {
            id: id
        };
        
        const risposta = await fetch(`${API_BASE_URL}/squarelife_protection/api/v0/switzerland/life_insurance/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-SQUARELIFE-APIKEY': API_KEY
            },
            body: JSON.stringify(datiEmissione)
        });
        
        if (!risposta.ok) {
            throw new Error('Errore nell\'emissione della polizza');
        }
        
        return await risposta.json();
        
    } catch (errore) {
        console.error('Errore nell\'emissione della polizza:', errore);
        return { errore: errore.message };
    }
}

// Funzione per recuperare un documento
function recuperaDocumento(documentPointer) {
    return `${API_BASE_URL}/document_pointer/${documentPointer}`;
}