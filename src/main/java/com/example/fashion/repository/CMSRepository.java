package com.example.fashion.repository;

import com.example.fashion.entity.StaticPage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CMSRepository extends JpaRepository<StaticPage, Long> {
    boolean existsBySlug(String slug);
}
