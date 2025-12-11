package com.example.fashion.service;

import com.example.fashion.dto.CustomerRegisterRequestDTO;
import com.example.fashion.dto.LoginRequest;
import com.example.fashion.dto.LoginResponse; // <-- 1. Import LoginResponse
import com.example.fashion.dto.RegisterAdminRequest;
import com.example.fashion.entity.User;
import com.example.fashion.enums.Role;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

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
    public User registerCustomer(CustomerRegisterRequestDTO request) {
        // 1. Kiểm tra email tồn tại
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // 2. Tạo User mới
        User customer = new User();
        customer.setEmail(request.getEmail());
        customer.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());

        // 3. Gán vai trò CUSTOMER
        customer.setRoles(Set.of(Role.CUSTOMER));
        customer.setStatus("active");
        customer.setEmailVerified(false);

        // 4. Lưu vào DB
        return userRepository.save(customer);
    }
    // ===================================


    /**
     * Logic đăng ký tài khoản SUPER_ADMIN
     */
    public User registerSuperAdmin(RegisterAdminRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        User adminUser = new User();
        adminUser.setEmail(request.getEmail());
        adminUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        adminUser.setFullName(request.getFullName());
        adminUser.setRoles(Set.of(Role.SUPER_ADMIN));
        adminUser.setStatus("active");
        adminUser.setEmailVerified(true);
        return userRepository.save(adminUser);
    }
}