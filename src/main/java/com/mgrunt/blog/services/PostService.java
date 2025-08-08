package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.CreatePostRequest;
import com.mgrunt.blog.domain.entities.Post;
import com.mgrunt.blog.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);
    Post createPost(User user, CreatePostRequest createPostRequest);
}
