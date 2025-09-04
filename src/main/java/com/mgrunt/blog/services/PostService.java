package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.CreatePostRequest;
import com.mgrunt.blog.domain.UpdatePostRequest;
import com.mgrunt.blog.domain.dtos.PostDto;
import com.mgrunt.blog.domain.entities.Post;
import com.mgrunt.blog.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {
    Post getPost(UUID id);
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);
    Post createPost(User user, CreatePostRequest createPostRequest);
    Post updatePost(User loggedInUser, UUID id, UpdatePostRequest updatePostRequest);
    void deletePost(UUID id);
    Post toggleLike(UUID postId, UUID userId);
    PostDto addUserContext(Post post, UUID userId);
}
