package com.mgrunt.blog.repositories;

import com.mgrunt.blog.domain.PostStatus;
import com.mgrunt.blog.domain.entities.Category;
import com.mgrunt.blog.domain.entities.Post;
import com.mgrunt.blog.domain.entities.Tag;
import com.mgrunt.blog.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findAllByStatusAndCategoryAndTagsContainingOrderByCreatedAtDesc(PostStatus status, Category category, Tag tag);
    List<Post> findAllByStatusAndCategoryOrderByCreatedAtDesc(PostStatus status, Category category);
    List<Post> findAllByStatusAndTagsContainingOrderByCreatedAtDesc(PostStatus status, Tag tag);
    List<Post> findAllByStatusOrderByCreatedAtDesc(PostStatus postStatus);
    List<Post> findAllByAuthorAndStatusOrderByCreatedAtDesc(User author, PostStatus status);
}
