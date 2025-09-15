package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.entities.PostImage;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface PostImageService {
    PostImage createImage(MultipartFile file);

    default boolean isValidImageType(String contentType) {
        return contentType != null &&
                (contentType.startsWith("image/jpeg") ||
                        contentType.startsWith("image/png") ||
                        contentType.startsWith("image/gif"));
    }

    PostImage getImageById(UUID id);
    void deleteImage(UUID id);
    PostImage updateImageIfChanged(PostImage currentImage, MultipartFile newFile);
}
