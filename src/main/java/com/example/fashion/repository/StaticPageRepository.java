// src/main/java/com/example/fashion/repository/StaticPageRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.StaticPage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StaticPageRepository extends JpaRepository<StaticPage, Long> {

    // THÊM DÒNG NÀY ĐỂ TÌM TRANG THEO SLUG
    Optional<StaticPage> findBySlug(String slug);
}