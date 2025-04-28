
// Inizializza cURL
$ch = curl_init();

// Imposta le opzioni di cURL
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

// Imposta header e body
$headers = [
    'Content-Type: application/json',
    'X-SQUARELIFE-APIKEY: ' . $apiKey
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

if ($method === 'POST') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
}

// Esegui la richiesta
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Gestione errori
if (curl_errno($ch)) {
    echo json_encode(['errore' => curl_error($ch)]);
    exit;
}

// Chiudi curl
curl_close($ch);

// Restituisci la risposta
http_response_code($httpCode);
echo $response;
