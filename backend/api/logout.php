<?php
// User logout endpoint
require_once '../config/database.php';
require_once '../includes/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$headers = getallheaders();
$token = $headers['Authorization'] ?? '';

if (strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
    $auth = new Auth();
    
    if ($auth->logout($token)) {
        echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Logout failed']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No valid session token provided']);
}
?>