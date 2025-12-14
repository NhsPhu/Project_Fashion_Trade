package com.example.fashion.service;

import com.example.fashion.entity.User;
import com.example.fashion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // === SỬA CHỈ PHẦN NÀY: THÊM CẢ HAI DẠNG AUTHORITY ===
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Dạng không có prefix (match "ADMIN", "SUPER_ADMIN", ...)
        user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .forEach(authorities::add);

        // Dạng có prefix (match "ROLE_ADMIN", "ROLE_SUPER_ADMIN", ...)
        user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .forEach(authorities::add);
        // ====================================================

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }
}