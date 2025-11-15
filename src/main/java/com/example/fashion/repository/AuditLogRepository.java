// src/main/java/com/example/fashion/repository/AuditLogRepository.java
package com.example.fashion.repository;

import com.example.fashion.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}