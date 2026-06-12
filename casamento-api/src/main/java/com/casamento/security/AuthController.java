package com.casamento.security;

import com.casamento.domain.user.User;
import com.casamento.domain.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        String nickname = normalizeNickname(req.getNickname());
        if (nickname.length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Digite seu nome (ao menos 2 letras)");
        }
        if (userRepository.existsByNicknameIgnoreCase(nickname)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esse nome já está em uso. Tente outro.");
        }

        User user = User.builder()
                .nickname(nickname)
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .build();

        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getId(), user.getNickname());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, toDto(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByNicknameIgnoreCase(normalizeNickname(req.getNickname()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getNickname());
        return ResponseEntity.ok(new AuthResponse(token, toDto(user)));
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getNickname(), u.getAvatarUrl());
    }

    /** Remove espaços nas pontas e colapsa espaços internos. Aceita nome com espaços e acentos. */
    private static String normalizeNickname(String raw) {
        return raw == null ? "" : raw.trim().replaceAll("\\s+", " ");
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        @Size(min = 2, max = 50, message = "O nome deve ter entre 2 e 50 caracteres")
        private String nickname;
        @NotBlank
        @Size(min = 4, max = 100, message = "A senha precisa ter ao menos 4 caracteres")
        private String password;
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String nickname;
        @NotBlank
        private String password;
    }

    public record AuthResponse(String token, UserDto user) {}

    public record UserDto(java.util.UUID id, String nickname, String avatarUrl) {}
}
