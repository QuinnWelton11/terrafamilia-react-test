// API service for backend communication

const API_BASE_URL = "https://yourdomain.com/api"; // Update with your actual domain
// For development, you might use: 'http://localhost/api' or your cPanel domain

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  session_token?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem("auth_token");
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      // Handle authentication errors
      if (response.status === 401) {
        this.removeAuthToken();
        window.location.href = "/sso";
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error("Network error occurred");
    }
  }

  // Authentication methods
  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    country: string;
    state_province: string;
    phone_number?: string;
  }): Promise<AuthResponse> {
    return this.makeRequest("/register.php", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.makeRequest("/login.php", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.session_token) {
      this.setAuthToken(response.session_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.makeRequest("/logout.php", {
      method: "POST",
    });

    this.removeAuthToken();
    return response;
  }

  async getCurrentUser(): Promise<{
    success: boolean;
    user?: User;
    authenticated: boolean;
  }> {
    return this.makeRequest("/me.php");
  }

  // Forum methods
  async getCategories(): Promise<ApiResponse> {
    return this.makeRequest("/categories.php");
  }

  async getPosts(
    params: {
      category_id?: number;
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ): Promise<ApiResponse> {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return this.makeRequest(`/posts.php?${queryString}`);
  }

  async createPost(postData: {
    title: string;
    content: string;
    category_id: number;
  }): Promise<ApiResponse> {
    return this.makeRequest("/posts.php", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }

  async getReplies(postId: number): Promise<ApiResponse> {
    return this.makeRequest(`/replies.php?post_id=${postId}`);
  }

  async createReply(replyData: {
    post_id: number;
    content: string;
    parent_reply_id?: number;
  }): Promise<ApiResponse> {
    return this.makeRequest("/replies.php", {
      method: "POST",
      body: JSON.stringify(replyData),
    });
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export default new ApiService();
export type { User, AuthResponse, ApiResponse };
