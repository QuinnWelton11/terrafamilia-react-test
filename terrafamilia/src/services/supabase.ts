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
  country?: string;
  state_province?: string;
  phone_number?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
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
    return data;
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
        profiles:user_id (id, username, full_name),
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
        profiles:user_id (id, username, full_name)
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
        profiles:user_id (username),
        categories:category_id (slug)
      `
      )
      .order("last_reply_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}

export default new SupabaseService();
