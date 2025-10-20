<?php
// Posts management (GET, POST)
require_once '../config/database.php';
require_once '../includes/auth.php';

setCorsHeaders();

$database = new Database();
$conn = $database->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        getPosts($conn);
        break;
    case 'POST':
        createPost($conn);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

function getPosts($conn) {
    $category_id = $_GET['category_id'] ?? null;
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;
    $search = $_GET['search'] ?? '';
    
    try {
        $where_clauses = ['p.id IS NOT NULL'];
        $params = [];
        
        if ($category_id) {
            $where_clauses[] = 'p.category_id = :category_id';
            $params[':category_id'] = $category_id;
        }
        
        if ($search) {
            $where_clauses[] = '(p.title LIKE :search OR p.content LIKE :search)';
            $params[':search'] = '%' . $search . '%';
        }
        
        $where_sql = implode(' AND ', $where_clauses);
        
        // Get posts with user and category info
        $query = "SELECT p.id, p.title, p.content, p.is_pinned, p.is_locked, 
                         p.view_count, p.reply_count, p.created_at, p.updated_at,
                         u.username, u.full_name,
                         c.name as category_name, c.slug as category_slug
                  FROM posts p
                  JOIN users u ON p.user_id = u.id
                  JOIN categories c ON p.category_id = c.id
                  WHERE $where_sql
                  ORDER BY p.is_pinned DESC, p.created_at DESC
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        
        $stmt->execute();
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get total count for pagination
        $count_query = "SELECT COUNT(*) as total FROM posts p WHERE $where_sql";
        $count_stmt = $conn->prepare($count_query);
        foreach ($params as $key => $value) {
            $count_stmt->bindValue($key, $value);
        }
        $count_stmt->execute();
        $total = $count_stmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        echo json_encode([
            'success' => true,
            'posts' => $posts,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => intval($total),
                'pages' => ceil($total / $limit)
            ]
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function createPost($conn) {
    $user = requireAuth();
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($input['title']) || empty($input['content']) || empty($input['category_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title, content, and category are required']);
        return;
    }
    
    // Validate title length
    if (strlen($input['title']) > 255) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Title must be 255 characters or less']);
        return;
    }
    
    try {
        // Verify category exists
        $cat_query = "SELECT id FROM categories WHERE id = :category_id AND is_active = 1";
        $cat_stmt = $conn->prepare($cat_query);
        $cat_stmt->bindParam(':category_id', $input['category_id']);
        $cat_stmt->execute();
        
        if ($cat_stmt->rowCount() === 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid category']);
            return;
        }
        
        // Insert post
        $query = "INSERT INTO posts (user_id, category_id, title, content) 
                 VALUES (:user_id, :category_id, :title, :content)";
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->bindParam(':category_id', $input['category_id']);
        $stmt->bindParam(':title', $input['title']);
        $stmt->bindParam(':content', $input['content']);
        
        if ($stmt->execute()) {
            $post_id = $conn->lastInsertId();
            
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Post created successfully',
                'post_id' => $post_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create post']);
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>