package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.dtos.CategoryDto;
import com.mgrunt.blog.domain.entities.Category;

import java.util.List;

public interface CategoryService {

    List<Category> listCategories();

    Category createCategory(Category category);
}
