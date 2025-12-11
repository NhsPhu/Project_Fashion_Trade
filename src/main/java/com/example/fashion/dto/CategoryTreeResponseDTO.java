package com.example.fashion.dto;

import com.example.fashion.entity.Category;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
    public class CategoryTreeResponseDTO {

    private Long id;
    private String name;
    private String slug;
    private Integer sortOrder;
    private boolean active;
    private Set<CategoryTreeResponseDTO> children;

    public static CategoryTreeResponseDTO fromCategory(Category category) {
        CategoryTreeResponseDTO dto = new CategoryTreeResponseDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setSortOrder(category.getSortOrder());
        dto.setActive(category.isActive());

        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            dto.setChildren(category.getChildren().stream()
                    .map(CategoryTreeResponseDTO::fromCategory)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}



