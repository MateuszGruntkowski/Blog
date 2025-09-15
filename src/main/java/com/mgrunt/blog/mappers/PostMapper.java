package com.mgrunt.blog.mappers;

import com.mgrunt.blog.domain.CreatePostRequest;
import com.mgrunt.blog.domain.UpdatePostRequest;
import com.mgrunt.blog.domain.dtos.CreatePostRequestDto;
import com.mgrunt.blog.domain.dtos.PostDto;
import com.mgrunt.blog.domain.dtos.PostImageDto;
import com.mgrunt.blog.domain.dtos.UpdatePostRequestDto;
import com.mgrunt.blog.domain.entities.Post;
import com.mgrunt.blog.domain.entities.PostImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "image", source = "image")
    @Mapping(target = "likesCount", expression = "java(post.getLikes().size())")
    @Mapping(target = "commentsCount", expression = "java(post.getComments().size())")
    PostDto toDto(Post post);

    CreatePostRequest toCreatePostRequest(CreatePostRequestDto dto);

    @Mapping(target = "image", source = "image")
    UpdatePostRequest toUpdatePostRequest(UpdatePostRequestDto dto);

    @Mapping(target = "imageUrl", expression = "java(\"/api/posts/images/\" + postImage.getId())")
    PostImageDto toImageDto(PostImage postImage);
}
