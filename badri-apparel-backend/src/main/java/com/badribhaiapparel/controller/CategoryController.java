package com.badribhaiapparel.controller;

import com.badribhaiapparel.entity.Category;
import com.badribhaiapparel.repository.CategoryRepository;
import com.badribhaiapparel.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<Category>>builder()
                .success(true)
                .message("Categories fetched successfully")
                .data(categories)
                .build());
    }
}
