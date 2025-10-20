<?php
// Replies management (GET, POST)
require_once '../config/database.php';
require_once '../includes/auth.php';

setCorsHeaders();

$database = new Database();
$conn = $database->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        getReplies($conn);
        break;
    case 'POST':
        createReply($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getReplies($conn) {
    $post_id = $_GET['post_id'] ?? null;
    
    if (!$post_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Post ID is required']);
        return;
    }
    
    try {
        // Get replies with user info
        $query = "SELECT r.id, r.content, r.parent_reply_id, r.created_at, r.updated_at,
                         u.username, u.full_name
                  FROM replies r
                  JOIN users u ON r.user_id = u.id
                  WHERE r.post_id = :post_id
                  ORDER BY r.created_at ASC";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':post_id', $post_id);
        $stmt->execute();
        $replies = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Update post view count
        $view_query = "UPDATE posts SET view_count = view_count + 1 WHERE id = :post_id";
        $view_stmt = $conn->prepare($view_query);
        $view_stmt->bindParam(':post_id', $post_id);
        $view_stmt->execute();
        
        echo json_encode([
            'success' => true,
            'replies' => $replies
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function createReply($conn) {
    $user = requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['post_id']) || empty($input['content'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Post ID and content are required']);
        return;
    }
    
    try {
        // Verify post exists and is not locked
        $post_query = "SELECT id, is_locked FROM posts WHERE id = :post_id";
        $post_stmt = $conn->prepare($post_query);
        $post_stmt->bindParam(':post_id', $input['post_id']);
        $post_stmt->execute();
        
        if ($post_stmt->rowCount() === 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Post not found']);
            return;
        }
        
        $post = $post_stmt->fetch(PDO::FETCH_ASSOC);
        if ($post['is_locked']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'This post is locked and cannot receive replies']);
            return;
        }
        
        // Verify parent reply exists if specified
        if (!empty($input['parent_reply_id'])) {
            $parent_query = "SELECT id FROM replies WHERE id = :parent_id AND post_id = :post_id";
            $parent_stmt = $conn->prepare($parent_query);
            $parent_stmt->bindParam(':parent_id', $input['parent_reply_id']);
            $parent_stmt->bindParam(':post_id', $input['post_id']);
            $parent_stmt->execute();
            
            if ($parent_stmt->rowCount() === 0) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Parent reply not found']);
                return;
            }
        }
        
        // Insert reply
        $query = "INSERT INTO replies (post_id, user_id, content, parent_reply_id) 
                 VALUES (:post_id, :user_id, :content, :parent_reply_id)";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':post_id', $input['post_id']);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->bindParam(':content', $input['content']);
        $stmt->bindParam(':parent_reply_id', $input['parent_reply_id'] ?? null);
        
        if ($stmt->execute()) {
            $reply_id = $conn->lastInsertId();
            
            // Update post reply count and last reply info
            $update_query = "UPDATE posts SET 
                            reply_count = reply_count + 1,
                            last_reply_at = CURRENT_TIMESTAMP,
                            last_reply_user_id = :user_id
                            WHERE id = :post_id";
            
            $update_stmt = $conn->prepare($update_query);
            $update_stmt->bindParam(':user_id', $user['id']);
            $update_stmt->bindParam(':post_id', $input['post_id']);
            $update_stmt->execute();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Reply created successfully',
                'reply_id' => $reply_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create reply']);
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>