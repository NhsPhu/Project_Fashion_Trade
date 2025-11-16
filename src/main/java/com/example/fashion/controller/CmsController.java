// src/main/java/com/example/fashion/controller/admin/CmsController.java
package com.example.fashion.controller;

import com.example.fashion.entity.StaticPage;
import com.example.fashion.repository.StaticPageRepository;
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
                    existing.setMetaTitle(page.getMetaTitle());           // ĐÃ SỬA
                    existing.setMetaDescription(page.getMetaDescription()); // ĐÃ SỬA
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
}