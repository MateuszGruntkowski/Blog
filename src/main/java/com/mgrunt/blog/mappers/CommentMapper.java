package com.mgrunt.blog.mappers;

import com.mgrunt.blog.domain.dtos.CommentDto;
import com.mgrunt.blog.domain.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {

    CommentDto toDto(Comment comment);
}
