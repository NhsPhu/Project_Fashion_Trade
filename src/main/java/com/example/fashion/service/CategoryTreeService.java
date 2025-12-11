package com.example.fashion.service;

import com.example.fashion.dto.CategoryTreeResponseDTO;
import com.example.fashion.entity.Category;
import com.example.fashion.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoryTreeService {

    private final CategoryRepository categoryRepository;

    public CategoryTreeService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryTreeResponseDTO> getRootCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .filter(category -> category.getParent() == null)
                .map(this::buildTree)
                .collect(Collectors.toList());
    }

    private CategoryTreeResponseDTO buildTree(Category category) {
        CategoryTreeResponseDTO dto = CategoryTreeResponseDTO.fromCategory(category);
        if (category.getChildren() != null) {
            Set<CategoryTreeResponseDTO> childDtos = category.getChildren().stream()
                    .map(this::buildTree)
                    .collect(Collectors.toSet());
            dto.setChildren(childDtos);
        }
        return dto;
    }
}



