<?php
/**
 * checkusersha3.php - Step 1 Authentication
 * Verify username and SHA3-hashed password
 * Return JWT token with SHA3 verification hash
 */

header('Content-Type: application/json');

// CORS Configuration - Allow specific origins with credentials
$allowedOrigins = [
    'null', // For local file:// protocol (development)
    'http://localhost',
    'http://127.0.0.1',
    'https://thepapers.in', // Main domain
    'https://www.thepapers.in', // WWW variant
    'https://yourdomain.com' // Replace with your production domain
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Default to null origin for local development
    header('Access-Control-Allow-Origin: null');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing username or password']);
    exit();
}

$username = trim($input['username']);
$hashedPassword = $input['password']; // Already SHA3-512 hashed from client

// ==========================================
// DATABASE CONNECTION (Update with your DB)
// ==========================================
// For demo purposes, using hardcoded users
// In production, use MySQL/PostgreSQL database

$validUsers = [
    'demo' => [
        'password_sha3' => hash('sha3-512', 'demo123'), // Pre-hash password with SHA3
        'pin' => '123456',
        'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE' // Replace with actual token
    ],
    'admin' => [
        'password_sha3' => hash('sha3-512', 'admin123'),
        'pin' => 'ABC123',
        'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE'
    ]
];

// Check if user exists
if (!isset($validUsers[$username])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit();
}

$user = $validUsers[$username];

// Verify password (compare SHA3 hashes)
if ($hashedPassword !== $user['password_sha3']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    exit();
}

// ==========================================
// GENERATE JWT TOKEN
// ==========================================
function generateJWT($username, $secretKey) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'username' => $username,
        'iat' => time(),
        'exp' => time() + 3600, // Expires in 1 hour
        'nonce' => bin2hex(random_bytes(16))
    ]);
    
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secretKey, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Secret key for JWT (store in environment variable in production)
$jwtSecret = 'YOUR_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION_' . hash('sha3-256', 'deriv-secure-auth');

// Generate JWT
$jwt = generateJWT($username, $jwtSecret);

// Generate SHA3 hash of JWT for verification
$jwtHash = hash('sha3-512', $jwt);

// Store JWT in session (server-side)
session_start();
$_SESSION['auth_jwt'] = $jwt;
$_SESSION['username'] = $username;
$_SESSION['pin'] = $user['pin'];
$_SESSION['deriv_token'] = $user['deriv_token'];
$_SESSION['login_time'] = time();

// Set HttpOnly cookie for additional security
setcookie(
    'auth_session',
    session_id(),
    [
        'expires' => time() + 3600,
        'path' => '/',
        'domain' => '', // Set your domain
        'secure' => true, // HTTPS only
        'httponly' => true, // Cannot be accessed by JavaScript
        'samesite' => 'Strict'
    ]
);

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Authentication successful',
    'jwt' => $jwt,
    'hash' => $jwtHash,
    'username' => $username,
    'timestamp' => time()
]);

// Log successful login (optional)
error_log("Successful login: $username at " . date('Y-m-d H:i:s'));
?>
