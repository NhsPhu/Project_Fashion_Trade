package com.example.fashion.dto;

import com.example.fashion.entity.Address;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AddressResponseDTO {
    private Long id;
    private String name;
    private String phone;
    private String addressLine;
    private String city;
    private String district;
    private String province;
    private String postalCode;
<<<<<<< HEAD
    private boolean defaultShipping;
    private boolean defaultBilling;
    private LocalDateTime createdAt;

    public static AddressResponseDTO fromAddress(Address address, Long defaultShippingId, Long defaultBillingId) {
=======
    private boolean isDefault;
    private LocalDateTime createdAt;

    public static AddressResponseDTO fromAddress(Address address) {
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        AddressResponseDTO dto = new AddressResponseDTO();
        dto.setId(address.getId());
        dto.setName(address.getName());
        dto.setPhone(address.getPhone());
        dto.setAddressLine(address.getAddressLine());
        dto.setCity(address.getCity());
        dto.setDistrict(address.getDistrict());
        dto.setProvince(address.getProvince());
        dto.setPostalCode(address.getPostalCode());
<<<<<<< HEAD
        dto.setDefaultShipping(defaultShippingId != null && address.getId().equals(defaultShippingId));
        dto.setDefaultBilling(defaultBillingId != null && address.getId().equals(defaultBillingId));
=======
        dto.setDefault(address.isDefault());
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
        dto.setCreatedAt(address.getCreatedAt());
        return dto;
    }
}




