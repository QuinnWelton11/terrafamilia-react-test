<?php
// Get categories and subcategories
require_once '../config/database.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    // Get all categories with their subcategories
    $query = "SELECT c1.id, c1.name, c1.slug, c1.description, c1.sort_order,
                     c2.id as sub_id, c2.name as sub_name, c2.slug as sub_slug, 
                     c2.description as sub_description, c2.sort_order as sub_sort_order
              FROM categories c1
              LEFT JOIN categories c2 ON c1.id = c2.parent_id
              WHERE c1.parent_id IS NULL AND c1.is_active = 1
              ORDER BY c1.sort_order, c2.sort_order";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize the data into a nested structure
    $categories = [];
    foreach ($results as $row) {
        $cat_id = $row['id'];
        
        if (!isset($categories[$cat_id])) {
            $categories[$cat_id] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'slug' => $row['slug'],
                'description' => $row['description'],
                'sort_order' => $row['sort_order'],
                'subcategories' => []
            ];
        }
        
        if ($row['sub_id']) {
            $categories[$cat_id]['subcategories'][] = [
                'id' => $row['sub_id'],
                'name' => $row['sub_name'],
                'slug' => $row['sub_slug'],
                'description' => $row['sub_description'],
                'sort_order' => $row['sub_sort_order']
            ];
        }
    }
    
    echo json_encode([
        'success' => true,
        'categories' => array_values($categories)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>