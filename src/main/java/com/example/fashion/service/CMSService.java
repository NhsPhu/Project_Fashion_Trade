package com.example.fashion.service;

import com.example.fashion.dto.CMSRequestDTO;
import com.example.fashion.dto.CMSResponseDTO;

import java.util.List;

public interface CMSService {
    List<CMSResponseDTO> getAllPages();
    CMSResponseDTO createPage(CMSRequestDTO dto);
    CMSResponseDTO updatePage(Long id, CMSRequestDTO dto);
    void deletePage(Long id);
}
