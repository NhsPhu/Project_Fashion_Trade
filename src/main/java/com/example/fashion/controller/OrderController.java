package com.example.fashion.controller;

import com.example.fashion.dto.CheckoutRequestDTO;
import com.example.fashion.dto.OrderResponseDTO; // Import DTO
import com.example.fashion.entity.Order;
import com.example.fashion.entity.User;
import com.example.fashion.repository.UserRepository;
import com.example.fashion.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/user/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập để thực hiện chức năng này.");
        }
        try {
            String userEmail;
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserDetails) {
                userEmail = ((UserDetails) principal).getUsername();
            } else {
                userEmail = principal.toString();
            }
            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin người dùng cho email: " + userEmail));
            Long userId = currentUser.getId();
            
            Order order = orderService.checkout(userId, request);

            // SỬA LỖI: Chuyển đổi Entity sang DTO trước khi trả về
            OrderResponseDTO responseDTO = OrderResponseDTO.fromOrder(order);
            return ResponseEntity.ok(responseDTO);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập để xem đơn hàng.");
        }
        try {
            String userEmail = authentication.getName();
            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));
            List<Order> orders = orderService.getOrdersByUserId(currentUser.getId());
            
            // Chuyển đổi List<Order> sang List<OrderResponseDTO>
            List<OrderResponseDTO> responseDTOs = orders.stream()
                    .map(OrderResponseDTO::fromOrder)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responseDTOs);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMyOrderDetail(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập để xem đơn hàng.");
        }
        try {
            String userEmail = authentication.getName();
            User currentUser = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng."));
            Order order = orderService.getOrderDetails(id, currentUser.getId());

            // Chuyển đổi Entity sang DTO
            OrderResponseDTO responseDTO = OrderResponseDTO.fromOrder(order);
            return ResponseEntity.ok(responseDTO);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
