package com.mgrunt.blog.controllers;

import com.mgrunt.blog.domain.dtos.CategoryDto;
import com.mgrunt.blog.domain.entities.Category;
import com.mgrunt.blog.mappers.CategoryMapper;
import com.mgrunt.blog.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryDtoMapper;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories(){
        List<CategoryDto> categories = categoryService.listCategories()
                .stream()
                .map(categoryDtoMapper::toDto)
                .toList();
        return ResponseEntity.ok(categories);
    }
}
