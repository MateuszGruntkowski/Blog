package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.dtos.CategoryDto;
import com.mgrunt.blog.domain.entities.Category;

import java.util.List;
import java.util.UUID;

public interface CategoryService {

    List<Category> listCategories();

    Category createCategory(Category category);

    void deleteCategory(UUID id);
}
