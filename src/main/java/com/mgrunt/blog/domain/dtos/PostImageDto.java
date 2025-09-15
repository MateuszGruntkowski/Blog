package com.mgrunt.blog.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PostImageDto {
    private UUID id;
    private String fileName;
    private String contentType;
    private String imageUrl;
    private LocalDateTime createdAt;
}
