<?php
/**
 * Telegram Proxy Script
 * Relays messages from the client to the Telegram Bot API.
 * This prevents mixed content warnings and CORS issues.
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    // Fallback to $_POST if not JSON
    $input = $_POST;
}

$token = isset($input['token']) ? trim($input['token']) : '';
$chat_id = isset($input['chat_id']) ? trim($input['chat_id']) : '';
$message = isset($input['message']) ? trim($input['message']) : '';

// Validate inputs
if (empty($token) || empty($chat_id) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters (token, chat_id, message)']);
    exit;
}

// Telegram API URL
$url = "https://api.telegram.org/bot{$token}/sendMessage";

// Prepare data
$data = [
    'chat_id' => $chat_id,
    'text' => $message,
    'parse_mode' => 'HTML' // Allow simple HTML formatting
];

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // For local testing environments
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $error]);
} else {
    // Return original response
    http_response_code($http_code);
    echo $response;
}
?>
