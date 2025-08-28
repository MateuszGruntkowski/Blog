package com.mgrunt.blog.controllers;

import com.mgrunt.blog.domain.dtos.CommentDto;
import com.mgrunt.blog.domain.dtos.CreateCommentRequest;
import com.mgrunt.blog.domain.entities.Comment;
import com.mgrunt.blog.domain.entities.User;
import com.mgrunt.blog.mappers.CommentMapper;
import com.mgrunt.blog.security.BlogUserDetails;
import com.mgrunt.blog.services.CommentService;
import com.mgrunt.blog.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final CommentMapper commentMapper;
    private final UserService userService;

    @GetMapping(path = "posts/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable UUID postId){
        List<CommentDto> comments = commentService.getCommentsByPost(postId)
                .stream()
                .map(commentMapper::toDto)
                .toList();
        return ResponseEntity.ok(comments);
    }

    @PostMapping(path = "posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable UUID postId,
            @Valid @RequestBody CreateCommentRequest createCommentRequest,
            @RequestAttribute UUID userId
            ){
        User loggedInUser = userService.getUserById(userId);
        Comment comment = commentService.createComment(loggedInUser, createCommentRequest, postId);
        CommentDto createdCommentDto = commentMapper.toDto(comment);

        return new ResponseEntity<>(createdCommentDto, HttpStatus.CREATED);

    }
}
