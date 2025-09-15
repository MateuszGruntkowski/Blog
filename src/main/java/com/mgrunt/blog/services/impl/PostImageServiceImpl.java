package com.mgrunt.blog.services.impl;

import com.mgrunt.blog.domain.entities.PostImage;
import com.mgrunt.blog.repositories.PostImageRepository;
import com.mgrunt.blog.services.PostImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostImageServiceImpl implements PostImageService {

    private final PostImageRepository postImageRepository;

    @Override
    public PostImage createImage(MultipartFile file){
        try{
            if (!isValidImageType(file.getContentType())) {
                throw new IllegalArgumentException("Invalid file type");
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("File is too large");
            }

            PostImage postImage = new PostImage();
            postImage.setFileName(file.getOriginalFilename());
            postImage.setContentType(file.getContentType());
            postImage.setImageData(file.getBytes());
            postImage.setCreatedAt(LocalDateTime.now());

            return postImageRepository.save(postImage);
        }catch(IOException e){
            throw new RuntimeException("Error saving image", e);
        }
    }

    @Override
    public PostImage getImageById(UUID id) {
        return postImageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Image with id: " + id + " cannot be found."));
    }

    @Override
    public void deleteImage(UUID id) {
        postImageRepository.deleteById(id);
    }

    public PostImage updateImageIfChanged(PostImage currentImage, MultipartFile newFile) {
        if (newFile == null || newFile.isEmpty()) {
            return currentImage;
        }

        try {
            boolean isSameFile = currentImage != null
                    && Objects.equals(currentImage.getFileName(), newFile.getOriginalFilename())
                    && Objects.equals(currentImage.getContentType(), newFile.getContentType())
                    && currentImage.getImageData().length == newFile.getSize()
                    && Arrays.equals(currentImage.getImageData(), newFile.getBytes());

            if (isSameFile) {
                return currentImage;
            }

            return this.createImage(newFile);
        } catch (IOException e) {
            throw new RuntimeException("Error comparing image", e);
        }
    }
}
