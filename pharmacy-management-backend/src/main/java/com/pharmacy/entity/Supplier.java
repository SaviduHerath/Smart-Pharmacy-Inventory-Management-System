package com.pharmacy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Supplier company/person name
    @Column(nullable = false)
    private String name;

    // Contact email
    private String email;

    // Contact phone number
    private String phone;

    // Supplier address
    private String address;

    // Whether the supplier is currently active
    private boolean active = true;
}