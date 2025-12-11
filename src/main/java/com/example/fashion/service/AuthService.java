package com.example.fashion.service;

<<<<<<< HEAD
import com.example.fashion.dto.CustomerRegisterRequestDTO;
import com.example.fashion.dto.LoginRequest;
import com.example.fashion.dto.LoginResponse; // <-- 1. Import LoginResponse
import com.example.fashion.dto.RegisterAdminRequest;
=======
import com.example.fashion.dto.*;
import com.example.fashion.entity.AuditLog;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.AuditLogRepository;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.security.JwtTokenProvider;
import com.example.fashion.security.TwoFactorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
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

<<<<<<< HEAD
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Logic đăng nhập cho User thường (trả về String token)
     */
=======
    // CUSTOMER LOGIN
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
    public String loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtTokenProvider.generateToken(authentication);
    }

<<<<<<< HEAD
    /**
     * Logic đăng nhập cho ADMIN (trả về LoginResponse Object)
     * Đây là hàm bị thiếu gây ra lỗi ở Controller
     */
    public LoginResponse adminLogin(LoginRequest request) {
        // 1. Xác thực qua Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Kiểm tra lại user trong DB để check quyền
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 3. KIỂM TRA QUYỀN: Nếu chỉ là CUSTOMER thì không cho vào trang Admin
        boolean isCustomerOnly = user.getRoles().size() == 1 && user.getRoles().contains(Role.CUSTOMER);
        if (isCustomerOnly) {
            throw new RuntimeException("Bạn không có quyền truy cập vào trang quản trị!");
        }

        // 4. Tạo token
        String token = jwtTokenProvider.generateToken(authentication);

        // 5. Trả về đối tượng LoginResponse
        return LoginResponse.builder()
                .token(token)
                .refreshToken("") // Nếu chưa dùng refresh token thì để rỗng hoặc null
                .build();
    }

    // ========== THÊM HÀM MỚI ==========
    /**
     * Logic đăng ký cho Khách hàng (Customer)
     */
=======
    // ADMIN LOGIN + 2FA
    public LoginResponse adminLogin(LoginRequest request) {
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

>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
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
<<<<<<< HEAD

        // 4. Lưu vào DB
=======
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
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