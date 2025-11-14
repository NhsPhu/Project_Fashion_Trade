package com.example.fashion.dto;

import com.example.fashion.entity.Address;
import com.example.fashion.entity.User;
import com.example.fashion.entity.UserProfile;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProfileResponseDTO {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private Long defaultShippingAddressId;
    private Long defaultBillingAddressId;
    private String status;
    private boolean emailVerified;
    private LocalDateTime createdAt;
    private Set<AddressResponseDTO> addresses;

    public static ProfileResponseDTO fromUser(User user) {
        ProfileResponseDTO dto = new ProfileResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public static ProfileResponseDTO fromUser(User user, UserProfile userProfile, List<Address> addresses) {
        ProfileResponseDTO dto = fromUser(user);

        if (userProfile != null) {
            dto.setAvatar(userProfile.getAvatarUrl());
            dto.setDefaultShippingAddressId(userProfile.getDefaultShippingAddressId());
            dto.setDefaultBillingAddressId(userProfile.getDefaultBillingAddressId());
        }

        if (addresses != null) {
            dto.setAddresses(addresses.stream()
                    .map(AddressResponseDTO::fromAddress)
                    .collect(Collectors.toSet()));
        }

        return dto;
    }
}

