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

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    // 1. Xóa @Autowired ở đây và làm cho nó 'final'
    private final UserRepository userRepository;

    // 2. Tạo hàm khởi tạo (constructor) để Spring tự động "tiêm" (inject) UserRepository
    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository; // Cảnh báo "never assigned" sẽ biến mất
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Tìm user bằng email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // Chuyển đổi Set<Role> (Enum) thành Set<GrantedAuthority>
        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toSet());

        // Trả về đối tượng UserDetails mà Spring Security hiểu
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                authorities
        );
    }
}