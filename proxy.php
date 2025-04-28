<?php
// Abilita visualizzazione errori per debug
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Imposta header per consentire accesso da qualsiasi origine

// Ottieni i dati inviati dal modulo
$postData = file_get_contents('php://input');

// Configura la richiesta cURL
$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'X-SQUARELIFE-APIKEY: ' . $apiKey
));
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disabilita verifica SSL per test

// Esegui la richiesta e ottieni la risposta
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Se c'è un errore cURL, registralo
if (curl_errno($ch)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Errore cURL: ' . curl_error($ch)
    ]);
    exit;
}

curl_close($ch);

// Invia la risposta al client
echo $response;
?>
