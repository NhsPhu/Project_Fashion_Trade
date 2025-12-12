package com.example.fashion.service;

import com.example.fashion.dto.CMSRequestDTO;
import com.example.fashion.dto.CMSResponseDTO;
import com.example.fashion.entity.StaticPage;
import com.example.fashion.repository.StaticPageRepository;
import com.example.fashion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CMSServiceImpl implements UserRepository.CMSService {

    private final StaticPageRepository repository;

    @Override
    public List<CMSResponseDTO> getAllPages() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CMSResponseDTO createPage(CMSRequestDTO dto) {
        StaticPage page = new StaticPage();
        page.setTitle(dto.getTitle());
        page.setSlug(dto.getSlug());
        page.setContent(dto.getContent());
        page.setMetaTitle(dto.getMetaTitle());
        page.setMetaDescription(dto.getMetaDescription());
        page.setMetaKeywords(dto.getMetaKeywords());
        page.setOgImage(dto.getOgImage());
        page.setPublished(dto.isPublished());

        StaticPage saved = repository.save(page);
        return toResponseDTO(saved);
    }

    @Override
    public CMSResponseDTO updatePage(Long id, CMSRequestDTO dto) {
        StaticPage page = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Page not found"));

        page.setTitle(dto.getTitle());
        page.setSlug(dto.getSlug());
        page.setContent(dto.getContent());
        page.setMetaTitle(dto.getMetaTitle());
        page.setMetaDescription(dto.getMetaDescription());
        page.setMetaKeywords(dto.getMetaKeywords());
        page.setOgImage(dto.getOgImage());
        page.setPublished(dto.isPublished());

        StaticPage updated = repository.save(page);
        return toResponseDTO(updated);
    }

    @Override
    public void deletePage(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Page not found");
        }
        repository.deleteById(id);
    }

    // ----------------------
    // DTO MAPPER
    // ----------------------
    private CMSResponseDTO toResponseDTO(StaticPage entity) {
        return CMSResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .content(entity.getContent())
                .metaTitle(entity.getMetaTitle())
                .metaDescription(entity.getMetaDescription())
                .metaKeywords(entity.getMetaKeywords())
                .ogImage(entity.getOgImage())
                .published(entity.isPublished())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
