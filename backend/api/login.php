<?php
// User login endpoint
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
if (empty($input['username']) || empty($input['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit();
}

$auth = new Auth();
$result = $auth->login($input['username'], $input['password']);

if ($result['success']) {
    http_response_code(200);
} else {
    http_response_code(401);
}

echo json_encode($result);
?>