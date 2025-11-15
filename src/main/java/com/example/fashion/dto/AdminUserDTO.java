package com.example.fashion.dto;

import com.example.fashion.enums.Permission;
import com.example.fashion.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter @Builder
public class AdminUserDTO {
    private Long id;
    private String email;
    private String fullName;
    private Set<Role> roles;
    private Set<Permission> permissions;
    private boolean twoFactorEnabled;
}