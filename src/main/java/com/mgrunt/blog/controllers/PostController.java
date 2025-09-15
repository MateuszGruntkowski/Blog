package com.mgrunt.blog.controllers;

import com.mgrunt.blog.domain.CreatePostRequest;
import com.mgrunt.blog.domain.UpdatePostRequest;
import com.mgrunt.blog.domain.dtos.CreatePostRequestDto;
import com.mgrunt.blog.domain.dtos.PostDto;
import com.mgrunt.blog.domain.dtos.UpdatePostRequestDto;
import com.mgrunt.blog.domain.entities.Post;
import com.mgrunt.blog.domain.entities.PostImage;
import com.mgrunt.blog.domain.entities.User;
import com.mgrunt.blog.mappers.PostMapper;
import com.mgrunt.blog.services.PostImageService;
import com.mgrunt.blog.services.PostService;
import com.mgrunt.blog.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostImageService postImageService;
    private final PostMapper postMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID tagId,
            @RequestAttribute(required = false) UUID userId){
        List<Post> posts = postService.getAllPosts(categoryId, tagId);

        List<PostDto> postDtos;
        if (userId != null) {
            // if user is logged in -> add user's context
            postDtos = posts.stream()
                    .map(post -> postService.addUserContext(post, userId))
                    .toList();
        } else {
            // For non-logged-in users -> return posts data without user context
            postDtos = posts.stream()
                    .map(postMapper::toDto)
                    .toList();
        }

        return ResponseEntity.ok(postDtos);
    }

    @GetMapping(path="/drafts")
    public ResponseEntity<List<PostDto>> getDrafts(@RequestAttribute UUID userId){
        User loggedInUser = userService.getUserById(userId);
        List<Post> draftPosts = postService.getDraftPosts(loggedInUser);
        List<PostDto> draftPostDtos = draftPosts.stream()
                .map(postMapper::toDto)
                .toList();
        return ResponseEntity.ok(draftPostDtos);
    }

    @GetMapping("/images/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable UUID id) {
        PostImage image = postImageService.getImageById(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + image.getFileName() + "\"")
                .body(image.getImageData());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestPart("post") CreatePostRequestDto createPostRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestAttribute UUID userId) {

        createPostRequestDto.setImage(image);

        User loggedInUser = userService.getUserById(userId);
        CreatePostRequest createPostRequest = postMapper.toCreatePostRequest(createPostRequestDto);

        Post createdPost = postService.createPost(loggedInUser, createPostRequest);
        PostDto createdPostDto = postMapper.toDto(createdPost);
        return new ResponseEntity<>(createdPostDto, HttpStatus.CREATED);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> updatePost(
            @PathVariable UUID id,
            @Valid @RequestPart("post") UpdatePostRequestDto updatePostRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestAttribute UUID userId){

        updatePostRequestDto.setImage(image);

        User loggedInUser = userService.getUserById(userId);
        UpdatePostRequest updatePostRequest = postMapper.toUpdatePostRequest(updatePostRequestDto);

        Post updatedPost = postService.updatePost(loggedInUser, id, updatePostRequest);
        PostDto updatedPostDto = postMapper.toDto(updatedPost);
        return ResponseEntity.ok(updatedPostDto);
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<PostDto> getPost(
            @PathVariable UUID id,
            @RequestAttribute(required = false) UUID userId) {
        Post post = postService.getPost(id);

        // if user is logged in -> add user's context
        if (userId != null) {
            PostDto postDto = postService.addUserContext(post, userId);
            return ResponseEntity.ok(postDto);
        } else {
            // For non-logged-in users -> return basic post data
            PostDto postDto = postMapper.toDto(post);
            postDto.setLikesCount(post.getLikes().size());
            postDto.setIsLikedByCurrentUser(false);
            return ResponseEntity.ok(postDto);
        }
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable UUID id,
            @RequestAttribute UUID userId) {

        Post post = postService.getPost(id);
        User loggedInUser = userService.getUserById(userId);

        if(loggedInUser.getRole().name().equals("ADMIN") || post.getAuthor().getId().equals(userId)){
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @PostMapping(path = "/{id}/like")
    public ResponseEntity<PostDto> likePost(
            @PathVariable UUID id,
            @RequestAttribute UUID userId
    ){
        Post likedPost = postService.toggleLike(id, userId);
        PostDto dto = postService.addUserContext(likedPost, userId);
        return ResponseEntity.ok(dto);
    }
}
