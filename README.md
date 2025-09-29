# Blog Platform

A full-featured blog platform with post creation, drafts, image uploads, comments, likes, and admin moderation. Users can write and share content, while admins manage tags, categories, and moderate posts.

## 🔑 Main Features

- **Authentication**: User registration and login (JWT)  
- **Posts**: CRUD operations, drafts, likes, image uploads  
- **Comments**: Add and delete comments  
- **Categories**: Category management (ADMIN only)  
- **Tags**: Tag management (ADMIN only)  

## 🚀 Technologies

- Spring Boot 3.x  
- Spring Security + JWT  
- PostgreSQL 
- Spring Data JPA
- React 19
- OpenAPI/Swagger  

## 📚 API Documentation

Full API documentation is available in Swagger UI once the application is running:

**URL:** `http://localhost:8080/swagger-ui/index.html`

The documentation includes:  
- All endpoints
- Request/response schemas  
- Ability to test endpoints directly in the browser  
- JWT Bearer Token support  

### Authorization in Swagger

For endpoints requiring authorization:  
1. Log in using the `/api/v1/auth/login` endpoint  
2. Copy the returned token  
3. Click the **"Authorize"** button in Swagger UI  
4. Paste the token (without the `Bearer` prefix)  
5. Click **"Authorize"**  

