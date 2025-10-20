<?php
// Get current user info endpoint
require_once '../config/database.php';
require_once '../includes/auth.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$user = getCurrentUser();

if ($user) {
    echo json_encode([
        'success' => true,
        'user' => $user,
        'authenticated' => true
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Not authenticated',
        'authenticated' => false
    ]);
}
?>