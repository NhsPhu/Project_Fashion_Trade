package com.example.fashion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequestDTO {
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
=======
    private boolean isDefault;
>>>>>>> b332b90e2796b2d564ff0c65f80141d694ab4a22
}




