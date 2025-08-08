package com.mgrunt.blog.mappers;

import com.mgrunt.blog.domain.CreatePostRequest;
import com.mgrunt.blog.domain.dtos.CreatePostRequestDto;
import com.mgrunt.blog.domain.dtos.PostDto;
import com.mgrunt.blog.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags")
    PostDto toDto(Post post);

    CreatePostRequest toCreatePostRequest(CreatePostRequestDto dto);
}
