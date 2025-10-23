<?php
// Database configuration
// Update these values with your actual database credentials from cPanel

class Database {
    private $host = 'localhost:3306'; // MAMP MySQL server
    private $db_name = 'terrafamilia-react'; // Your MAMP database name
    private $username = 'root'; // MAMP default username
    private $password = 'root'; // MAMP default password
    private $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
            );
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

// CORS headers for React frontend
function setCorsHeaders() {
    // Update this with your actual domain when deployed
    $allowed_origins = [
        'http://localhost:5173', // Vite development server
        'http://localhost:3000', // Alternative dev server
        'http://localhost:8888', // MAMP Apache server
        'https://yourdomain.com' // Your actual domain
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// JWT Secret Key - Change this to a random string for security
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production');

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1); // Set to 1 if using HTTPS
ini_set('session.use_strict_mode', 1);

// Error reporting (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');
?>