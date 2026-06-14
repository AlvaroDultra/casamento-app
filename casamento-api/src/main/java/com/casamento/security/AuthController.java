package com.casamento.security;

import com.casamento.domain.user.User;
import com.casamento.domain.user.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    /**
     * Login sem senha (identidade por aparelho): o convidado informa só o nome
     * e já recebe um token, que o navegador guarda. Cada chamada cria uma nova
     * identidade — o "estar logado" depois vem do token salvo no aparelho.
     */
    @PostMapping("/guest")
    public ResponseEntity<AuthResponse> guest(@Valid @RequestBody GuestRequest req) {
        String nickname = normalizeNickname(req.getNickname());
        if (nickname.length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Digite seu nome (ao menos 2 letras)");
        }
        User user = userRepository.save(User.builder().nickname(nickname).build());
        String token = jwtUtil.generateToken(user.getId(), user.getNickname());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, toDto(user)));
    }

    /** Remove espaços nas pontas e colapsa espaços internos. */
    private static String normalizeNickname(String raw) {
        return raw == null ? "" : raw.trim().replaceAll("\\s+", " ");
    }

    private UserDto toDto(User u) {
        return new UserDto(u.getId(), u.getNickname(), u.getAvatarUrl());
    }

    @Data
    public static class GuestRequest {
        @NotBlank
        @Size(min = 2, max = 50, message = "O nome deve ter entre 2 e 50 caracteres")
        private String nickname;
    }

    public record AuthResponse(String token, UserDto user) {}

    public record UserDto(java.util.UUID id, String nickname, String avatarUrl) {}
}
