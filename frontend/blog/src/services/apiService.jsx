import axios from "axios";

class ApiService {
  constructor() {
    this.baseUrl = "http://localhost:8080/api";
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor do automatycznego dodawania tokenu
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor do obsługi błędów
    // this.axiosInstance.interceptors.response.use(
    //   (response) => response,
    //   (error) => {
    //     if (error.response?.status === 401) {
    //       localStorage.removeItem("token");
    //       window.location.href = "/auth";
    //     }
    //     return Promise.reject(error);
    //   }
    // );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const currentPath = window.location.pathname;

          if (!currentPath.includes("/auth") && localStorage.getItem("token")) {
            localStorage.removeItem("token");
            window.location.href = "/auth";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.axiosInstance.post(
      "/v1/auth/login",
      credentials
    );
    return response.data;
  }

  async register(userData) {
    const response = await this.axiosInstance.post(
      "/v1/auth/register",
      userData
    );
    return response.data;
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.axiosInstance.get("/v1/categories");
    return response.data;
  }

  async createCategory(category) {
    const response = await this.axiosInstance.post("/v1/categories", category);
    return response.data;
  }

  async deleteCategory(id) {
    await this.axiosInstance.delete(`/v1/categories/${id}`);
  }

  // Tags endpoints
  async getTags() {
    const response = await this.axiosInstance.get("/v1/tags");
    return response.data;
  }

  async createTags(tags) {
    const response = await this.axiosInstance.post("/v1/tags", tags);
    return response.data;
  }

  async deleteTag(id) {
    await this.axiosInstance.delete(`/v1/tags/${id}`);
  }

  // Posts endpoints
  async getPosts(params = {}) {
    const response = await this.axiosInstance.get("/v1/posts", { params });
    return response.data;
  }

  async getPost(postId) {
    const response = await this.axiosInstance.get(`/v1/posts/${postId}`);
    return response.data;
  }

  async getDraftPosts() {
    const response = await this.axiosInstance.get("/v1/posts/drafts");
    return response.data;
  }

  async createPost(post) {
    const response = await this.axiosInstance.post("/v1/posts", post, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  }

  async getPostImage(id) {
    const response = await this.axiosInstance.get(`/v1/posts/images/${id}`, {
      responseType: "blob",
    });
    return response.data;
  }

  async updatePost(id, post) {
    const response = await this.axiosInstance.put(`/v1/posts/${id}`, post, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response.data;
  }

  async deletePost(id) {
    await this.axiosInstance.delete(`/v1/posts/${id}`);
  }

  async togglePostLike(id) {
    const response = await this.axiosInstance.post(`/v1/posts/${id}/like`);
    return response.data;
  }

  // Comments endpoints
  async getComments(postId) {
    const response = await this.axiosInstance.get(
      `/v1/posts/${postId}/comments`
    );
    return response.data;
  }

  async createComment(postId, comment) {
    const response = await this.axiosInstance.post(
      `/v1/posts/${postId}/comments`,
      comment
    );
    return response.data;
  }

  async deleteComment(commentId) {
    const response = await this.axiosInstance.delete(
      `/v1/comments/${commentId}`
    );
    return response.data;
  }
}

export default new ApiService();
