package com.mgrunt.blog.services.impl;

import com.mgrunt.blog.domain.entities.Category;
import com.mgrunt.blog.repositories.CategoryRepository;
import com.mgrunt.blog.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCount();
    }
}
