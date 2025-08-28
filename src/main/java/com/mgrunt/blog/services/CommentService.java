package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.dtos.CreateCommentRequest;
import com.mgrunt.blog.domain.entities.Comment;
import com.mgrunt.blog.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    List<Comment> getCommentsByPost(UUID postId);
    Comment createComment(User loggedInUser, CreateCommentRequest createCommentRequest, UUID postId);
}
