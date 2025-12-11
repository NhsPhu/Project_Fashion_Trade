package com.example.fashion.service;

import com.example.fashion.entity.User;
import com.example.fashion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng: " + email));

        Set<GrantedAuthority> authorities = Stream.concat(
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())),
                user.getPermissions().stream()
                        .map(perm -> new SimpleGrantedAuthority(perm.name()))
        ).collect(Collectors.toSet());

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(!"active".equals(user.getStatus()))
                .credentialsExpired(false)
                .disabled(!"active".equals(user.getStatus()))
                .build();
    }

    // FILE HOÀN CHỈNH CUỐI CÙNG – ĐÃ SỬA getName() → fullName + LOG CHI TIẾT
    public List<Long> getAllowedWarehouseIdsByEmail(String email) {
        System.out.println(">>> [WAREHOUSE] Bắt đầu lấy kho cho email: " + email);

        return userRepository.findByEmail(email)
                .map(user -> {
                    Long userId = user.getId();
                    String fullName = user.getFullName() != null ? user.getFullName() : "N/A";

                    System.out.println(">>> [WAREHOUSE] Tìm thấy user - ID = " + userId + " | FullName = " + fullName + " | Email = " + user.getEmail());

                    List<Long> warehouses = jdbcTemplate.queryForList(
                            "SELECT warehouse_id FROM user_warehouse_access WHERE user_id = ?",
                            Long.class,
                            userId
                    );

                    System.out.println(">>> [WAREHOUSE] Kết quả truy vấn kho: " + warehouses);
                    return warehouses;
                })
                .orElseGet(() -> {
                    System.out.println(">>> [WAREHOUSE] Không tìm thấy user với email: " + email);
                    return List.of();
                });
    }
}