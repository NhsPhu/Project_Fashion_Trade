// src/main/java/com/example/fashion/repository/StaticPageRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.StaticPage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaticPageRepository extends JpaRepository<StaticPage, Long> {
}