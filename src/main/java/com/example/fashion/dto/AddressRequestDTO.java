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
    private boolean isDefault;
}




