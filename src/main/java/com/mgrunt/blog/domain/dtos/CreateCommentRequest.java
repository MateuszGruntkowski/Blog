package com.mgrunt.blog.domain.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CreateCommentRequest {
    @NotBlank(message = "Content is required")
    @Size(min = 2, max = 1000, message = "content must be between {min} and {max} characters")
    private String content;
}
