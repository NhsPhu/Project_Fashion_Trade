// src/main/java/com/example/fashion/service/UserProfileService.java
package com.example.fashion.service;

import com.example.fashion.dto.*;
import com.example.fashion.entity.Address;
import com.example.fashion.entity.Order;
import com.example.fashion.entity.User;
import com.example.fashion.entity.UserProfile;
import com.example.fashion.repository.AddressRepository;
import com.example.fashion.repository.OrderRepository;
import com.example.fashion.repository.ReviewRepository;
import com.example.fashion.repository.UserProfileRepository;
import com.example.fashion.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserRepository userRepository,
                              AddressRepository addressRepository,
                              OrderRepository orderRepository,
                              ReviewRepository reviewRepository,
                              UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Lấy thông tin profile của user
     */
    @Transactional(readOnly = true)
    public ProfileResponseDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + userId));
        UserProfile userProfile = userProfileRepository.findByUserId(userId).orElse(null);
        List<Address> addresses = addressRepository.findByUserId(userId);
        return ProfileResponseDTO.fromUser(user, userProfile, addresses);
    }

    /**
     * Cập nhật thông tin profile
     * → DỰA TRÊN ProfileUpdateRequestDTO (chỉ có fullName, phone, avatar)
     */
    @Transactional
    public ProfileResponseDTO updateProfile(Long userId, ProfileUpdateRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + userId));

        // Cập nhật User
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone().trim());
        }

        userRepository.save(user);

        // Cập nhật UserProfile (chỉ avatar)
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        if (request.getAvatar() != null && !request.getAvatar().trim().isEmpty()) {
            profile.setAvatarUrl(request.getAvatar().trim());
        }

        userProfileRepository.save(profile);

        return getProfile(userId);
    }

    /**
     * Lấy danh sách địa chỉ
     */
    @Transactional(readOnly = true)
    public List<AddressResponseDTO> getAddresses(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        Long shippingId = profile != null ? profile.getDefaultShippingAddressId() : null;
        Long billingId = profile != null ? profile.getDefaultBillingAddressId() : null;

        return addressRepository.findByUserId(userId).stream()
                .map(address -> AddressResponseDTO.fromAddress(address, shippingId, billingId))
                .collect(Collectors.toList());
    }

    /**
     * Thêm địa chỉ mới
     */
    @Transactional
    public AddressResponseDTO addAddress(Long userId, AddressRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createProfile(user));

        Address address = new Address();
        address.setUser(user);
        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setProvince(request.getProvince());
        address.setPostalCode(request.getPostalCode());
        address.setDefault(request.isDefaultShipping() || request.isDefaultBilling());

        Address savedAddress = addressRepository.save(address);
        applyDefaultFlags(profile, savedAddress.getId(), request.isDefaultShipping(), request.isDefaultBilling());

        return AddressResponseDTO.fromAddress(savedAddress,
                profile.getDefaultShippingAddressId(), profile.getDefaultBillingAddressId());
    }

    /**
     * Cập nhật địa chỉ
     */
    @Transactional
    public AddressResponseDTO updateAddress(Long userId, Long addressId, AddressRequestDTO request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ ID: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Địa chỉ không thuộc về user này");
        }

        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setProvince(request.getProvince());
        address.setPostalCode(request.getPostalCode());
        address.setDefault(request.isDefaultShipping() || request.isDefaultBilling());

        Address updatedAddress = addressRepository.save(address);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createProfile(address.getUser()));
        applyDefaultFlags(profile, updatedAddress.getId(), request.isDefaultShipping(), request.isDefaultBilling());

        return AddressResponseDTO.fromAddress(updatedAddress,
                profile.getDefaultShippingAddressId(), profile.getDefaultBillingAddressId());
    }

    /**
     * Xóa địa chỉ
     */
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ ID: " + addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Địa chỉ không thuộc về user này");
        }

        addressRepository.delete(address);

        userProfileRepository.findByUserId(userId).ifPresent(profile -> {
            if (address.getId().equals(profile.getDefaultShippingAddressId())) {
                profile.setDefaultShippingAddressId(null);
            }
            if (address.getId().equals(profile.getDefaultBillingAddressId())) {
                profile.setDefaultBillingAddressId(null);
            }
            userProfileRepository.save(profile);
        });
    }

    /**
     * Lịch sử hoạt động: đơn hàng + đánh giá
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getActivityHistory(Long userId) {
        Map<String, Object> history = new LinkedHashMap<>();

        // ĐƠN HÀNG: DÙNG Specification
        Specification<Order> orderSpec = (root, query, cb) ->
                cb.equal(root.get("user").get("id"), userId);

        List<Order> orders = orderRepository.findAll(orderSpec);
        history.put("orders", orders.stream()
                .map(OrderResponseDTO::fromOrder)
                .collect(Collectors.toList()));

        // ĐÁNH GIÁ
        history.put("reviews", reviewRepository.findByUserId(userId).stream()
                .map(ReviewResponseDTO::fromReview)
                .collect(Collectors.toList()));

        return history;
    }

    private UserProfile createProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        return userProfileRepository.save(profile);
    }

    private void applyDefaultFlags(UserProfile profile, Long addressId, boolean defaultShipping, boolean defaultBilling) {
        if (defaultShipping) {
            profile.setDefaultShippingAddressId(addressId);
        } else if (profile.getDefaultShippingAddressId() != null
                && profile.getDefaultShippingAddressId().equals(addressId)) {
            profile.setDefaultShippingAddressId(null);
        }

        if (defaultBilling) {
            profile.setDefaultBillingAddressId(addressId);
        } else if (profile.getDefaultBillingAddressId() != null
                && profile.getDefaultBillingAddressId().equals(addressId)) {
            profile.setDefaultBillingAddressId(null);
        }

        userProfileRepository.save(profile);
    }
}