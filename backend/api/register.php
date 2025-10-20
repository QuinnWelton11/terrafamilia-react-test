<?php
// User registration endpoint
require_once '../config/database.php';
require_once '../includes/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['username', 'email', 'password', 'full_name', 'country', 'state_province'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit();
}

// Validate email format
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Validate password strength (minimum 8 characters)
if (strlen($input['password']) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long']);
    exit();
}

// Validate username (alphanumeric and underscore only)
if (!preg_match('/^[a-zA-Z0-9_]{3,30}$/', $input['username'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username must be 3-30 characters and contain only letters, numbers, and underscores']);
    exit();
}

$auth = new Auth();
$result = $auth->register(
    $input['username'],
    $input['email'],
    $input['password'],
    $input['full_name'],
    $input['country'],
    $input['state_province'],
    $input['phone_number'] ?? null
);

if ($result['success']) {
    http_response_code(201);
} else {
    http_response_code(400);
}

echo json_encode($result);
?>