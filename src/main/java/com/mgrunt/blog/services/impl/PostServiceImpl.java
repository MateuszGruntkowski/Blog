package com.mgrunt.blog.services.impl;

import com.mgrunt.blog.domain.CreatePostRequest;
import com.mgrunt.blog.domain.PostStatus;
import com.mgrunt.blog.domain.UpdatePostRequest;
import com.mgrunt.blog.domain.dtos.PostDto;
import com.mgrunt.blog.domain.entities.Category;
import com.mgrunt.blog.domain.entities.Post;
import com.mgrunt.blog.domain.entities.Tag;
import com.mgrunt.blog.domain.entities.User;
import com.mgrunt.blog.mappers.PostMapper;
import com.mgrunt.blog.repositories.PostRepository;
import com.mgrunt.blog.services.CategoryService;
import com.mgrunt.blog.services.PostService;
import com.mgrunt.blog.services.TagService;
import com.mgrunt.blog.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final UserService userService;
    private final PostMapper postMapper;

    private static final int WORDS_PER_MINUTE = 200;

    @Override
    public Post getPost(UUID id) {
        return postRepository.findById(id).orElseThrow(() ->
            new EntityNotFoundException("Post with id '" + id + "' not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {
        if(categoryId != null && tagId != null){
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByStatusAndCategoryAndTagsContainingOrderByCreatedAtDesc(PostStatus.PUBLISHED, category, tag);
        }

        if(categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            return postRepository.findAllByStatusAndCategoryOrderByCreatedAtDesc(PostStatus.PUBLISHED, category);
        }

        if(tagId != null) {
            Tag tag = tagService.getTagById(tagId);
            return postRepository.findAllByStatusAndTagsContainingOrderByCreatedAtDesc(PostStatus.PUBLISHED, tag);
        }

        return postRepository.findAllByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED);

    }

    @Override
    public List<Post> getDraftPosts(User user) {
        return postRepository.findAllByAuthorAndStatusOrderByCreatedAtDesc(user, PostStatus.DRAFT);
    }

    @Override
    @Transactional
    public Post createPost(User user, CreatePostRequest createPostRequest) {
        Post newPost = new Post();
        newPost.setTitle(createPostRequest.getTitle());
        newPost.setContent(createPostRequest.getContent());
        newPost.setStatus(createPostRequest.getStatus());
        newPost.setAuthor(user);
        newPost.setReadingTime(calculateReadingTime(createPostRequest.getContent()));

        Category category = categoryService.getCategoryById(createPostRequest.getCategoryId());
        newPost.setCategory(category);

        Set<UUID> tagIds = createPostRequest.getTagIds();
        List<Tag> tags = tagService.getTagByIds(tagIds);
        newPost.setTags(new HashSet<>(tags));

        return postRepository.save(newPost);
    }

    @Override
    @Transactional
    public Post updatePost(User loggedInUser, UUID id, UpdatePostRequest updatePostRequest) {
        Post existingPost = postRepository.findById(id).orElseThrow(() ->
            new EntityNotFoundException("Post with id '" + id + "' not found."));

        if (!existingPost.getAuthor().getId().equals(loggedInUser.getId())) {
            throw new AccessDeniedException("You are not allowed to edit this post");
        }

        existingPost.setTitle(updatePostRequest.getTitle());
        existingPost.setContent(updatePostRequest.getContent());
        existingPost.setStatus(updatePostRequest.getStatus());
        existingPost.setReadingTime(calculateReadingTime(updatePostRequest.getContent()));

        UUID updatePostRequestCategoryId = updatePostRequest.getCategoryId();
        if(!existingPost.getCategory().getId().equals(updatePostRequestCategoryId)) {
            Category newCategory = categoryService.getCategoryById(updatePostRequestCategoryId);
            existingPost.setCategory(newCategory);
        }

        Set<UUID> existingTagIds = existingPost.getTags().stream().map(Tag::getId).collect(Collectors.toSet());
        Set<UUID> updatePostRequestTagIds = updatePostRequest.getTagIds();
        if(!existingTagIds.equals(updatePostRequestTagIds)) {
            List<Tag> newTags = tagService.getTagByIds(updatePostRequestTagIds);
            existingPost.setTags(new HashSet<>(newTags));
        }

        return postRepository.save(existingPost);
    }

    @Override
    public void deletePost(UUID id) {
        Post post = getPost(id);
        postRepository.delete(post);
    }

    @Override
    public Post toggleLike(UUID postId, UUID userId) {
        Post post = this.getPost(postId);

        User user = userService.getUserById(userId);

        if (post.getLikes().contains(user)) {
            post.getLikes().remove(user);
        } else {
            post.getLikes().add(user);
        }

        return postRepository.save(post);
    }

    public PostDto addUserContext(Post post, UUID userId) {
        PostDto dto = postMapper.toDto(post);
        dto.setIsLikedByCurrentUser(
                post.getLikes().stream()
                        .anyMatch(user -> user.getId().equals(userId))
        );
        return dto;
    }

    private Integer calculateReadingTime(String content) {
        if(content == null || content.isEmpty()){
            return 0;
        }
        int wordCount = content.trim().split("\\s+").length;
        return (int) Math.ceil((double) wordCount / WORDS_PER_MINUTE);
    }
}
