package com.example.fashion.service;

import com.example.fashion.dto.*;
import com.example.fashion.entity.AuditLog;
import com.example.fashion.entity.Cart;
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.AuditLogRepository;
import com.example.fashion.repository.CartRepository;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.security.JwtTokenProvider;
import com.example.fashion.security.TwoFactorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final TwoFactorService twoFactorService;
    private final AuditLogRepository auditLogRepository;
    private final CartRepository cartRepository; // Inject CartRepository
    private final HttpServletRequest httpServletRequest; // Inject HttpServletRequest

    // CUSTOMER LOGIN
    @Transactional
    public String loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // SỬA LỖI: Gộp giỏ hàng sau khi đăng nhập
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        mergeCartAfterLogin(user);

        String token = jwtTokenProvider.generateToken(authentication);
        System.out.println("DEBUG: Token được tạo khi đăng nhập: " + token);
        return token;
    }

    private void mergeCartAfterLogin(User user) {
        String sessionId = httpServletRequest.getHeader("X-Session-Id");
        if (StringUtils.hasText(sessionId)) {
            Optional<Cart> sessionCartOpt = cartRepository.findBySessionId(sessionId);
            if (sessionCartOpt.isPresent()) {
                Cart sessionCart = sessionCartOpt.get();
                
                // Kiểm tra xem user đã có giỏ hàng chưa
                Optional<Cart> userCartOpt = cartRepository.findByUserId(user.getId());
                if (userCartOpt.isPresent()) {
                    // User đã có giỏ hàng, gộp sản phẩm từ session cart vào
                    Cart userCart = userCartOpt.get();
                    sessionCart.getItems().forEach(sessionItem -> {
                        userCart.getItems().add(sessionItem);
                        sessionItem.setCart(userCart);
                    });
                    cartRepository.save(userCart);
                    cartRepository.delete(sessionCart); // Xóa giỏ hàng session cũ
                } else {
                    // User chưa có giỏ hàng, gán session cart cho user
                    sessionCart.setUser(user);
                    sessionCart.setSessionId(null); // Xóa session id
                    cartRepository.save(sessionCart);
                }
            }
        }
    }

    // ADMIN LOGIN + 2FA
    public LoginResponse adminLogin(LoginRequest request) {
        // ... (giữ nguyên logic admin login)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        if (user.isTwoFactorEnabled()) {
            if (request.getTotpCode() == null || request.getTotpCode().isBlank()) {
                throw new RuntimeException("Yêu cầu mã 2FA");
            }
            if (!twoFactorService.verify(user.getTwoFactorSecret(), request.getTotpCode())) {
                throw new RuntimeException("Mã 2FA không hợp lệ");
            }
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getEmail(), null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);
        System.out.println("DEBUG: Token được tạo khi đăng nhập (Admin): " + token);

        auditLogRepository.save(AuditLog.builder()
                .userId(user.getId())
                .action("ADMIN_LOGIN")
                .ipAddress("127.0.0.1")
                .build());

        AdminUserDTO adminUser = AdminUserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles())
                .permissions(user.getPermissions())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .build();

        return new LoginResponse(token, adminUser);
    }

    public User registerCustomer(CustomerRegisterRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        User customer = new User();
        customer.setEmail(request.getEmail());
        customer.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setRoles(Set.of(Role.CUSTOMER));
        customer.setStatus("active");
        customer.setEmailVerified(false);
        return userRepository.save(customer);
    }

    public User registerSuperAdmin(RegisterAdminRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        User admin = new User();
        admin.setEmail(request.getEmail());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setFullName(request.getFullName());
        admin.setRoles(Set.of(Role.SUPER_ADMIN));
        admin.setStatus("active");
        admin.setEmailVerified(true);
        return userRepository.save(admin);
    }
}
