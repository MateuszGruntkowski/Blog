package com.mgrunt.blog.domain.dtos;

import com.mgrunt.blog.domain.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDto {
    private UUID id;
    private String title;
    private String content;
    private AuthorDto author;
    private CategoryDto category;
    private Set<TagDto> tags;
    private Integer readingTime;
    private Integer likesCount;
    private Integer commentsCount;
    private PostImageDto image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PostStatus status;

    @Builder.Default
    private Boolean isLikedByCurrentUser = false;
}
