<?php
/**
 * checkuserstep2.php - Step 2 Authentication
 * Verify PIN and JWT token
 * Return encrypted Deriv API token
 */

// ==========================================
// LOCAL TEST MODE - SET TO false IN PRODUCTION!
// ==========================================
define('LOCAL_TEST_MODE', true);

// Test users for local development (same as checkusersha3.php)
$testUsers = [
    'demo' => [
        'pin' => '123456',
        'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE'
    ],
    'admin' => [
        'pin' => 'ABC123',
        'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE'
    ]
];

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

if (!$input || !isset($input['pin']) || !isset($input['jwt']) || !isset($input['username'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing PIN, JWT, or username']);
    exit();
}

$pin = trim($input['pin']);
$jwt = $input['jwt'];
$username = $input['username'];

// ==========================================
// VERIFY JWT TOKEN
// ==========================================
function verifyJWT($jwt, $secretKey) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header, $payload, $signature) = $parts;
    
    // Verify signature
    $validSignature = hash_hmac('sha256', $header . "." . $payload, $secretKey, true);
    $validBase64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));
    
    if ($signature !== $validBase64Signature) {
        return false;
    }
    
    // Decode payload
    $payloadData = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
    
    // Check expiration
    if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
        return false;
    }
    
    return $payloadData;
}

// Secret key (must match the one in checkusersha3.php)
$jwtSecret = 'YOUR_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION_' . hash('sha3-256', 'deriv-secure-auth');

// Verify JWT
$jwtPayload = verifyJWT($jwt, $jwtSecret);

if (!$jwtPayload) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired JWT token']);
    exit();
}

// Verify username matches JWT
if ($jwtPayload['username'] !== $username) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Username mismatch']);
    exit();
}

// ==========================================
// LOCAL TEST MODE - Skip session verification
// ==========================================
if (LOCAL_TEST_MODE) {
    // Use test user data instead of session
    if (!isset($testUsers[$username])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'User not found in test mode']);
        exit();
    }
    
    $storedPin = $testUsers[$username]['pin'];
    $derivToken = $testUsers[$username]['deriv_token'];
    
    // Verify PIN
    if ($pin !== $storedPin) {
        error_log("Failed PIN attempt for user: $username (TEST MODE)");
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid PIN']);
        exit();
    }
} else {
    // ==========================================
    // PRODUCTION MODE - VERIFY SESSION (HttpOnly Cookie)
    // ==========================================
    session_start();

    if (!isset($_SESSION['auth_jwt']) || $_SESSION['auth_jwt'] !== $jwt) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid session']);
        exit();
    }

    if (!isset($_SESSION['username']) || $_SESSION['username'] !== $username) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Session username mismatch']);
        exit();
    }

    // Check session timeout (1 hour)
    if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time']) > 3600) {
        session_destroy();
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Session expired']);
        exit();
    }

    // ==========================================
    // VERIFY PIN (Production)
    // ==========================================
    $storedPin = $_SESSION['pin'] ?? null;

    if (!$storedPin || $pin !== $storedPin) {
        // Log failed attempt
        error_log("Failed PIN attempt for user: $username");
        
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid PIN']);
        exit();
    }
    
    $derivToken = $_SESSION['deriv_token'] ?? null;
}

// ==========================================
// ENCRYPT AND RETURN API TOKEN
// ==========================================
$derivToken = $_SESSION['deriv_token'] ?? null;

if (!$derivToken) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'API token not found']);
    exit();
}

// Encrypt token with base64 (use stronger encryption in production)
// For production: Use AES-256-GCM or similar
$encryptedToken = base64_encode($derivToken);

// Generate SHA3 hash for verification
$tokenHash = hash('sha3-512', $encryptedToken);

// Update session
$_SESSION['authenticated'] = true;
$_SESSION['auth_time'] = time();

// Set authenticated cookie
setcookie(
    'deriv_auth',
    'authenticated',
    [
        'expires' => time() + 3600,
        'path' => '/',
        'domain' => '', // Set your domain
        'secure' => true, // HTTPS only
        'httponly' => true,
        'samesite' => 'Strict'
    ]
);

// Return success response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'PIN verified successfully',
    'encryptedToken' => $encryptedToken,
    'tokenHash' => $tokenHash,
    'loginId' => $username, // You can return actual Deriv login ID if stored
    'timestamp' => time()
]);

// Log successful authentication
error_log("Successful 2FA authentication: $username at " . date('Y-m-d H:i:s'));

// Clear sensitive session data (optional - keep JWT for future requests)
// unset($_SESSION['pin']);
?>
