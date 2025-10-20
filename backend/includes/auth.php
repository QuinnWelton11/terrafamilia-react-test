<?php
// User authentication and utility functions

require_once '../config/database.php';

class Auth {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    // Register a new user
    public function register($username, $email, $password, $full_name, $country, $state_province, $phone_number = null) {
        try {
            // Check if username or email already exists
            $check_query = "SELECT id FROM users WHERE username = :username OR email = :email";
            $check_stmt = $this->conn->prepare($check_query);
            $check_stmt->bindParam(':username', $username);
            $check_stmt->bindParam(':email', $email);
            $check_stmt->execute();
            
            if ($check_stmt->rowCount() > 0) {
                return ['success' => false, 'message' => 'Username or email already exists'];
            }
            
            // Hash password
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert new user
            $query = "INSERT INTO users (username, email, password_hash, full_name, country, state_province, phone_number) 
                     VALUES (:username, :email, :password_hash, :full_name, :country, :state_province, :phone_number)";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password_hash', $password_hash);
            $stmt->bindParam(':full_name', $full_name);
            $stmt->bindParam(':country', $country);
            $stmt->bindParam(':state_province', $state_province);
            $stmt->bindParam(':phone_number', $phone_number);
            
            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'User registered successfully'];
            } else {
                return ['success' => false, 'message' => 'Registration failed'];
            }
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    // Login user
    public function login($username, $password) {
        try {
            $query = "SELECT id, username, email, password_hash, full_name, is_admin FROM users 
                     WHERE (username = :username OR email = :username) AND is_active = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':username', $username);
            $stmt->execute();
            
            if ($stmt->rowCount() === 1) {
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if (password_verify($password, $user['password_hash'])) {
                    // Update last login
                    $update_query = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = :id";
                    $update_stmt = $this->conn->prepare($update_query);
                    $update_stmt->bindParam(':id', $user['id']);
                    $update_stmt->execute();
                    
                    // Create session token
                    $session_token = $this->createSessionToken($user['id']);
                    
                    // Remove password hash from response
                    unset($user['password_hash']);
                    
                    return [
                        'success' => true,
                        'message' => 'Login successful',
                        'user' => $user,
                        'session_token' => $session_token
                    ];
                } else {
                    return ['success' => false, 'message' => 'Invalid credentials'];
                }
            } else {
                return ['success' => false, 'message' => 'User not found'];
            }
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
        }
    }
    
    // Create session token
    private function createSessionToken($user_id) {
        $token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        try {
            // Clean up old sessions
            $cleanup_query = "DELETE FROM user_sessions WHERE user_id = :user_id OR expires_at < NOW()";
            $cleanup_stmt = $this->conn->prepare($cleanup_query);
            $cleanup_stmt->bindParam(':user_id', $user_id);
            $cleanup_stmt->execute();
            
            // Insert new session
            $query = "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (:user_id, :token, :expires_at)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':expires_at', $expires_at);
            $stmt->execute();
            
            return $token;
        } catch (PDOException $e) {
            return null;
        }
    }
    
    // Validate session token
    public function validateSession($token) {
        try {
            $query = "SELECT u.id, u.username, u.email, u.full_name, u.is_admin 
                     FROM users u 
                     JOIN user_sessions s ON u.id = s.user_id 
                     WHERE s.session_token = :token AND s.expires_at > NOW() AND u.is_active = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();
            
            if ($stmt->rowCount() === 1) {
                return $stmt->fetch(PDO::FETCH_ASSOC);
            }
            
            return false;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    // Logout (destroy session)
    public function logout($token) {
        try {
            $query = "DELETE FROM user_sessions WHERE session_token = :token";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            return $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }
    }
}

// Utility function to get user from session token
function getCurrentUser() {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';
    
    if (strpos($token, 'Bearer ') === 0) {
        $token = substr($token, 7);
        $auth = new Auth();
        return $auth->validateSession($token);
    }
    
    return false;
}

// Utility function to require authentication
function requireAuth() {
    $user = getCurrentUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit();
    }
    return $user;
}
?>