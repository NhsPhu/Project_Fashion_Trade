// src/main/java/com/example/fashion/controller/admin/CmsController.java
package com.example.fashion.controller;

import com.example.fashion.entity.StaticPage;
import com.example.fashion.repository.StaticPageRepository;
import com.example.fashion.dto.CMSResponseDTO; // Đảm bảo import đúng
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/cms/pages")
@PreAuthorize("hasAnyAuthority('CMS_PAGE_WRITE', 'ROLE_SUPER_ADMIN')")
public class CmsController {

    @Autowired
    private StaticPageRepository repository;

    @GetMapping
    public List<StaticPage> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<StaticPage> create(@RequestBody StaticPage page) {
        return ResponseEntity.ok(repository.save(page));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaticPage> update(@PathVariable Long id, @RequestBody StaticPage page) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setSlug(page.getSlug());
                    existing.setTitle(page.getTitle());
                    existing.setContent(page.getContent());
                    existing.setMetaTitle(page.getMetaTitle());
                    existing.setMetaDescription(page.getMetaDescription());
                    existing.setMetaKeywords(page.getMetaKeywords());
                    existing.setOgImage(page.getOgImage());
                    existing.setPublished(page.isPublished());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // API PUBLIC CHO NGƯỜI DÙNG CUỐI - KHÔNG CẦN ĐĂNG NHẬP
    @GetMapping("/api/v1/pages/{slug}")
    @PreAuthorize("permitAll()") // Cho mọi người truy cập
    public ResponseEntity<CMSResponseDTO> getPublicPage(@PathVariable String slug) {
        return repository.findBySlug(slug)
                .filter(StaticPage::isPublished)
                .map(this::toResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Mapper helper
    private CMSResponseDTO toResponseDTO(StaticPage entity) {
        return CMSResponseDTO.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .content(entity.getContent())
                .metaTitle(entity.getMetaTitle())
                .metaDescription(entity.getMetaDescription())
                .published(entity.isPublished())
                .build();
    }
}