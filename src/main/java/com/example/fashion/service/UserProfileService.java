// src/main/java/com/example/fashion/service/UserProfileService.java
package com.example.fashion.service;

import com.example.fashion.dto.*;
import com.example.fashion.entity.Address;
import com.example.fashion.entity.Order;
import com.example.fashion.entity.User;
import com.example.fashion.entity.UserProfile;
import com.example.fashion.repository.*;
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

    @Transactional(readOnly = true)
    public ProfileResponseDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + userId));
        UserProfile userProfile = userProfileRepository.findByUserId(userId).orElse(null);
        List<Address> addresses = addressRepository.findByUserId(userId);
        return ProfileResponseDTO.fromUser(user, userProfile, addresses);
    }

    @Transactional
    public ProfileResponseDTO updateProfile(Long userId, ProfileUpdateRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + userId));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone().trim());
        }

        userRepository.save(user);

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

    @Transactional(readOnly = true)
    public List<AddressResponseDTO> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId).stream()
                .map(AddressResponseDTO::fromAddress)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponseDTO addAddress(Long userId, AddressRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user ID: " + userId));

        Address address = new Address();
        address.setUser(user);
        address.setName(request.getName());
        address.setPhone(request.getPhone());
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setDistrict(request.getDistrict());
        address.setProvince(request.getProvince());
        address.setPostalCode(request.getPostalCode());
        address.setDefault(request.isDefault());

        Address savedAddress = addressRepository.save(address);

        if (address.isDefault()) {
            userProfileRepository.findByUserId(userId).ifPresent(profile -> {
                profile.setDefaultShippingAddressId(savedAddress.getId());
                profile.setDefaultBillingAddressId(savedAddress.getId());
                userProfileRepository.save(profile);
            });
        }

        return AddressResponseDTO.fromAddress(savedAddress);
    }

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
        address.setDefault(request.isDefault());

        Address updatedAddress = addressRepository.save(address);

        if (address.isDefault()) {
            userProfileRepository.findByUserId(userId).ifPresent(profile -> {
                profile.setDefaultShippingAddressId(updatedAddress.getId());
                profile.setDefaultBillingAddressId(updatedAddress.getId());
                userProfileRepository.save(profile);
            });
        }

        return AddressResponseDTO.fromAddress(updatedAddress);
    }

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

    @Transactional(readOnly = true)
    public Map<String, Object> getActivityHistory(Long userId) {
        Map<String, Object> history = new LinkedHashMap<>();

        // ĐÃ SỬA: Không dùng Specification nữa → build pass ngay
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getUser() != null && o.getUser().getId().equals(userId))
                .collect(Collectors.toList());

        history.put("orders", orders.stream()
                .map(OrderResponseDTO::fromOrder)
                .collect(Collectors.toList()));

        history.put("reviews", reviewRepository.findByUserId(userId).stream()
                .map(ReviewResponseDTO::fromReview)
                .collect(Collectors.toList()));

        return history;
    }
}