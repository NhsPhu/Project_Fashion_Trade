// src/main/java/com/example/fashion/dto/QAResponseDTO.java
package com.example.fashion.dto;

import com.example.fashion.entity.QA;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QAResponseDTO {
    private Long id;
    private String question;
    private String answer;
    private String userName;
    private String createdAt;

    public static QAResponseDTO fromQA(QA qa) {
        if (qa == null) return null;

        QAResponseDTO dto = new QAResponseDTO();
        dto.setId(qa.getId());
        dto.setQuestion(qa.getQuestion());
        dto.setAnswer(qa.getAnswer());

        // DÙNG fullName, không phải name
        dto.setUserName(qa.getUser() != null && qa.getUser().getFullName() != null
                ? qa.getUser().getFullName()
                : "Khách vãng lai");

        dto.setCreatedAt(qa.getCreatedAt() != null
                ? qa.getCreatedAt().toString()
                : null);

        return dto;
    }
}