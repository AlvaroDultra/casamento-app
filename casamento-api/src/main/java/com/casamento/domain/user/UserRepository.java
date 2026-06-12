package com.casamento.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByNicknameIgnoreCase(String nickname);
    boolean existsByNicknameIgnoreCase(String nickname);
}
