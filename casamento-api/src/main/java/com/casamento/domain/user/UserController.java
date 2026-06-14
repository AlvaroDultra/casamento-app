package com.casamento.domain.user;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        return toDto(user);
    }

    @GetMapping("/{id}")
    public UserDto getById(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convidado não encontrado"));
        return toDto(user);
    }

    @PatchMapping("/me")
    public UserDto updateMe(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateMeRequest req) {
        if (req.getAvatarUrl() != null) {
            user.setAvatarUrl(req.getAvatarUrl());
        }
        return toDto(userRepository.save(user));
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getNickname(), u.getAvatarUrl(), u.getCreatedAt());
    }

    @Data
    public static class UpdateMeRequest {
        private String avatarUrl;
    }

    public record UserDto(UUID id, String nickname, String avatarUrl, java.time.Instant createdAt) {}
}
