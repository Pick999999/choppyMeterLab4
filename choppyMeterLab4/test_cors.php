<?php
/**
 * test_cors.php - Test CORS Configuration
 * ใช้ไฟล์นี้ทดสอบ CORS ก่อน deploy ไป production
 */

header('Content-Type: application/json');

// CORS Configuration - Allow specific origins with credentials
$allowedOrigins = [
    'null', // For local file:// protocol (development)
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1',
    'https://yourdomain.com' // Replace with your production domain
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Default to null origin for local development
    header('Access-Control-Allow-Origin: null');
}

header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Test response
echo json_encode([
    'success' => true,
    'message' => 'CORS is working!',
    'received_origin' => $origin,
    'server_time' => date('Y-m-d H:i:s'),
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'headers' => [
        'Origin' => $origin,
        'User-Agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A'
    ]
]);
?>
