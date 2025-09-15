package com.mgrunt.blog.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name ="post_images")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String contentType;

    @Column(name = "image_data", nullable = false, columnDefinition = "bytea")
    private byte[] imageData;

    @OneToOne(mappedBy = "image", fetch = FetchType.LAZY)
    private Post post;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        PostImage postImage = (PostImage) o;
        return Objects.equals(id, postImage.id) && Objects.equals(fileName, postImage.fileName) && Objects.equals(contentType, postImage.contentType) && Objects.deepEquals(imageData, postImage.imageData) && Objects.equals(createdAt, postImage.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fileName, contentType, Arrays.hashCode(imageData), createdAt);
    }
}
