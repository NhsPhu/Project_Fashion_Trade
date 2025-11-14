// src/main/java/com/example/fashion/repository/QARepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.QA;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Set;

public interface QARepository extends JpaRepository<QA, Long> {
    Set<QA> findByProductId(Long productId);
}