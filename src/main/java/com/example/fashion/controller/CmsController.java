// src/main/java/com/example/fashion/controller/admin/CmsController.java
package com.example.fashion.controller; // giữ package cũ

import com.example.fashion.dto.CMSResponseDTO;
import com.example.fashion.entity.StaticPage;
import com.example.fashion.repository.StaticPageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/cms/pages") // giữ nguyên cho admin
<<<<<<< HEAD
// Thêm 'SUPER_ADMIN', 'ADMIN' và 'MARKETING' (nếu cần cho Marketing vào sửa bài)
@PreAuthorize("hasAnyAuthority('SUPER_ADMIN', 'ADMIN', 'MARKETING')")
=======
@PreAuthorize("hasAnyAuthority('CMS_PAGE_WRITE', 'ROLE_SUPER_ADMIN')")
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
public class CmsController {

    @Autowired
    private StaticPageRepository repository;

    // ==================== ADMIN ENDPOINTS ====================
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

    // ==================== PUBLIC ENDPOINT (MỚI) ====================
    // Đường dẫn public riêng, KHÔNG bị prefix admin
    @GetMapping("/api/v1/pages/{slug}")
    @PreAuthorize("permitAll()") // Cho mọi người vào
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<CMSResponseDTO> getPublicPage(@PathVariable String slug) {
        return repository.findBySlug(slug)
                .filter(StaticPage::isPublished)
                .map(this::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private CMSResponseDTO toDTO(StaticPage p) {
        return CMSResponseDTO.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .content(p.getContent())
                .metaTitle(p.getMetaTitle())
                .metaDescription(p.getMetaDescription())
                .published(p.isPublished())
                .build();
    }
}