package com.example.fashion.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "brands")
@Getter
@Setter
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(name = "slug", unique = true, length = 150)
    private String slug;

    @OneToMany(mappedBy = "brand")
    private Set<Product> products;
}
