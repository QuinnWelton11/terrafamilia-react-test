// Supabase client configuration
import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project credentials
// You can find these in your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
  country?: string;
  state_province?: string;
  phone_number?: string;
  is_admin: boolean;
  is_moderator: boolean;
  is_banned: boolean;
  banned_at?: string;
  banned_reason?: string;
  banned_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  reason?: string;
  metadata?: any;
  created_at: string;
  admin?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  sort_order: number;
  created_at: string;
  subcategories?: Category[];
}

export interface Post {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  content: string;
  images?: string[];
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at?: string;
  last_reply_user_id?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: Profile;
  categories?: Category;
  last_reply_user?: Profile;
}

export interface Reply {
  id: string;
  post_id: string;
  user_id: string;
  parent_reply_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profiles?: Profile;
  replies?: Reply[]; // Nested replies
}

class SupabaseService {
  // ============================================================================
  // SUPABASE CLIENT ACCESS
  // ============================================================================

  getSupabaseClient() {
    return supabase;
  }

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  async signUp(data: {
    email: string;
    password: string;
    username: string;
    full_name: string;
    country?: string;
    state_province?: string;
    phone_number?: string;
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          full_name: data.full_name,
        },
      },
    });

    if (authError) throw authError;

    // Update profile with additional info
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          country: data.country,
          state_province: data.state_province,
          phone_number: data.phone_number,
        })
        .eq("id", authData.user.id);

      if (profileError) throw profileError;
    }

    return authData;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    // Get email from auth.users
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.id === userId) {
      return { ...data, email: user.email };
    }

    return data;
  }

  async updateProfile(
    userId: string,
    updates: {
      username?: string;
      full_name?: string;
      country?: string;
      state_province?: string;
      phone_number?: string;
      avatar_url?: string;
    }
  ) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async uploadAvatar(file: File) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File exceeds 5MB limit");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    // Generate unique filename: userId/avatar-timestamp.ext
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}/avatar-${timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    // Update profile with new avatar URL
    await this.updateProfile(user.id, { avatar_url: publicUrl });

    return publicUrl;
  }

  async deleteAvatar() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (profile.avatar_url) {
      // Extract file path from URL
      const urlParts = profile.avatar_url.split("/avatars/");
      if (urlParts.length >= 2) {
        const filePath = urlParts[1];
        await supabase.storage.from("avatars").remove([filePath]);
      }
    }

    // Update profile to remove avatar URL
    await this.updateProfile(user.id, { avatar_url: undefined });
  }

  async updateEmail(newEmail: string) {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail,
    });

    if (error) throw error;
    return data;
  }

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("posts")
      .select(
        `
        *,
        categories:category_id (id, name, slug)
      `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      posts: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
  }

  // ============================================================================
  // CATEGORY METHODS
  // ============================================================================

  async getCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    // Organize into parent/child structure
    const parentCategories = data.filter((cat) => !cat.parent_id);
    const childCategories = data.filter((cat) => cat.parent_id);

    return parentCategories.map((parent) => ({
      ...parent,
      subcategories: childCategories.filter(
        (child) => child.parent_id === parent.id
      ),
    }));
  }

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  async getCategoryWithChildren(slug: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*, subcategories:categories!parent_id(id, slug, name)")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  // ============================================================================
  // POST METHODS
  // ============================================================================

  async getPosts(
    params: {
      category_id?: string;
      category_ids?: string[]; // Support multiple categories
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ) {
    const { category_id, category_ids, page = 1, limit = 20, search } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (id, username, full_name),
        categories:category_id (id, name, slug),
        last_reply_user:last_reply_user_id (id, username, full_name)
      `,
        { count: "exact" }
      )
      .order("is_pinned", { ascending: false })
      .order("last_reply_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category_id) {
      query = query.eq("category_id", category_id);
    } else if (category_ids && category_ids.length > 0) {
      query = query.in("category_id", category_ids);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      posts: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async getPostById(postId: string) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:user_id (id, username, full_name, avatar_url),
        categories:category_id (id, name, slug)
      `
      )
      .eq("id", postId)
      .single();

    if (error) throw error;

    // Increment view count
    await supabase.rpc("increment_view_count", { post_id: postId });

    return data;
  }

  async uploadPostImages(files: File[]) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error(`File ${file.name} exceeds 100MB limit`);
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error(`File ${file.name} is not an image`);
      }

      // Generate unique filename: userId/timestamp-originalname
      const timestamp = Date.now();
      const fileName = `${user.id}/${timestamp}-${file.name}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("post-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  }

  async deletePostImage(imageUrl: string) {
    // Extract file path from URL
    const urlParts = imageUrl.split("/post-images/");
    if (urlParts.length < 2) {
      throw new Error("Invalid image URL");
    }
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from("post-images")
      .remove([filePath]);

    if (error) throw error;
  }

  async createPost(data: {
    category_id: string;
    title: string;
    content: string;
    images?: string[];
  }) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        ...data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return post;
  }

  async updatePost(postId: string, data: { title?: string; content?: string }) {
    const { data: post, error } = await supabase
      .from("posts")
      .update(data)
      .eq("id", postId)
      .select()
      .single();

    if (error) throw error;
    return post;
  }

  async deletePost(postId: string) {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) throw error;
  }

  // ============================================================================
  // REPLY METHODS
  // ============================================================================

  async getReplies(postId: string) {
    const { data, error } = await supabase
      .from("replies")
      .select(
        `
        *,
        profiles:user_id (id, username, full_name, avatar_url)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Organize into nested structure
    const replyMap = new Map<string, Reply>();
    const rootReplies: Reply[] = [];

    // First pass: create map of all replies
    data.forEach((reply: any) => {
      replyMap.set(reply.id, { ...reply, replies: [] });
    });

    // Second pass: organize into tree structure
    data.forEach((reply: any) => {
      const replyWithChildren = replyMap.get(reply.id)!;
      if (reply.parent_reply_id) {
        const parent = replyMap.get(reply.parent_reply_id);
        if (parent) {
          parent.replies!.push(replyWithChildren);
        } else {
          rootReplies.push(replyWithChildren);
        }
      } else {
        rootReplies.push(replyWithChildren);
      }
    });

    return rootReplies;
  }

  async createReply(data: {
    post_id: string;
    content: string;
    parent_reply_id?: string;
  }) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const { data: reply, error } = await supabase
      .from("replies")
      .insert({
        ...data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Update post reply count and last reply info
    const { data: post } = await supabase
      .from("posts")
      .select("reply_count")
      .eq("id", data.post_id)
      .single();

    await supabase
      .from("posts")
      .update({
        reply_count: (post?.reply_count || 0) + 1,
        last_reply_at: new Date().toISOString(),
        last_reply_user_id: user.id,
      })
      .eq("id", data.post_id);

    return reply;
  }

  async updateReply(replyId: string, content: string) {
    const { data, error } = await supabase
      .from("replies")
      .update({ content })
      .eq("id", replyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteReply(replyId: string) {
    const { error } = await supabase.from("replies").delete().eq("id", replyId);

    if (error) throw error;
  }

  // ============================================================================
  // RECENT ACTIVITY
  // ============================================================================

  async getRecentActivity(limit: number = 5) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        category_id,
        last_reply_at,
        created_at,
        reply_count,
        profiles:user_id (id, username, full_name, avatar_url),
        categories:category_id (slug)
      `
      )
      .order("last_reply_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // ============================================================================
  // ADMIN METHODS
  // ============================================================================

  async getAllUsers(page: number = 1, limit: number = 20, search?: string) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(
        `username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      users: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async assignModeratorRole(userId: string, isModerator: boolean) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (!profile.is_admin) {
      throw new Error("Only admins can assign moderator roles");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ is_moderator: isModerator })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: isModerator ? "assign_moderator" : "remove_moderator",
      p_target_type: "user",
      p_target_id: userId,
    });

    return data;
  }

  async banUser(userId: string, reason: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (!profile.is_admin && !profile.is_moderator) {
      throw new Error("Only admins and moderators can ban users");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        is_banned: true,
        banned_at: new Date().toISOString(),
        banned_reason: reason,
        banned_by: user.id,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "ban_user",
      p_target_type: "user",
      p_target_id: userId,
      p_reason: reason,
    });

    return data;
  }

  async unbanUser(userId: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (!profile.is_admin && !profile.is_moderator) {
      throw new Error("Only admins and moderators can unban users");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        is_banned: false,
        banned_at: null,
        banned_reason: null,
        banned_by: null,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "unban_user",
      p_target_type: "user",
      p_target_id: userId,
    });

    return data;
  }

  async deletePostAsAdmin(postId: string, reason?: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (!profile.is_admin && !profile.is_moderator) {
      throw new Error("Only admins and moderators can delete posts");
    }

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) throw error;

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "delete_post",
      p_target_type: "post",
      p_target_id: postId,
      p_reason: reason,
    });
  }

  async deleteReplyAsAdmin(replyId: string, reason?: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (!profile.is_admin && !profile.is_moderator) {
      throw new Error("Only admins and moderators can delete replies");
    }

    const { error } = await supabase.from("replies").delete().eq("id", replyId);

    if (error) throw error;

    // Log admin action
    await supabase.rpc("log_admin_action", {
      p_admin_id: user.id,
      p_action_type: "delete_reply",
      p_target_type: "reply",
      p_target_id: replyId,
      p_reason: reason,
    });
  }

  async getAdminActions(page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("admin_actions")
      .select(
        `
        *,
        admin:admin_id (id, username, full_name)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      actions: data,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async getDashboardStats() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Must be authenticated");

    const profile = await this.getProfile(user.id);
    if (!profile.is_admin && !profile.is_moderator) {
      throw new Error("Only admins and moderators can view dashboard stats");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // Get total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Get today's new users
    const { count: todayUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    // Get banned users
    const { count: bannedUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_banned", true);

    // Get moderators
    const { count: moderators } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_moderator", true);

    // Get total posts
    const { count: totalPosts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    // Get today's posts
    const { count: todayPosts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    // Get total replies
    const { count: totalReplies } = await supabase
      .from("replies")
      .select("*", { count: "exact", head: true });

    // Get today's replies
    const { count: todayReplies } = await supabase
      .from("replies")
      .select("*", { count: "exact", head: true })
      .gte("created_at", todayISO);

    // Get recent admin actions
    const { data: recentActions } = await supabase
      .from("admin_actions")
      .select(
        `
        *,
        admin:admin_id (username)
      `
      )
      .order("created_at", { ascending: false })
      .limit(10);

    return {
      totalUsers: totalUsers || 0,
      todayUsers: todayUsers || 0,
      bannedUsers: bannedUsers || 0,
      moderators: moderators || 0,
      totalPosts: totalPosts || 0,
      todayPosts: todayPosts || 0,
      totalReplies: totalReplies || 0,
      todayReplies: todayReplies || 0,
      recentActions: recentActions || [],
    };
  }

  async getTopContributor() {
    try {
      // Get all posts
      const { data: posts, error } = await supabase
        .from("posts")
        .select("user_id");

      if (error || !posts || posts.length === 0) {
        console.error("Error fetching posts:", error);
        return null;
      }

      // Count posts per user
      const counts: Record<string, number> = {};
      posts.forEach((post: any) => {
        counts[post.user_id] = (counts[post.user_id] || 0) + 1;
      });

      // Find user with most posts
      const topUserEntry = Object.entries(counts).sort(
        (a, b) => b[1] - a[1]
      )[0];

      if (!topUserEntry) return null;

      const [topUserId, postCount] = topUserEntry;

      // Get that user's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", topUserId)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching profile:", profileError);
        return null;
      }

      return {
        id: profile.id,
        username: profile.username,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        postCount: postCount,
      };
    } catch (error) {
      console.error("Error in getTopContributor:", error);
      return null;
    }
  }
}

export default new SupabaseService();
