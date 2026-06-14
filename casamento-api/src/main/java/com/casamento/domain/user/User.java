package com.casamento.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Nome de exibição (pode repetir entre convidados — a identidade é o id)
    @Column(nullable = false, length = 50)
    private String nickname;

    // Sem uso no login por aparelho; mantido nullable por compatibilidade
    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
