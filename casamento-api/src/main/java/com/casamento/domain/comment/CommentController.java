package com.casamento.domain.comment;

import com.casamento.domain.user.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    public List<CommentService.CommentResponse> getByPost(@PathVariable UUID postId) {
        return commentService.getByPost(postId);
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentService.CommentResponse> create(
            @AuthenticationPrincipal User user,
            @PathVariable UUID postId,
            @Valid @RequestBody CreateCommentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.create(postId, user.getId(), req.getContent()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        commentService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class CreateCommentRequest {
        @NotBlank
        @Size(max = 1000)
        private String content;
    }
}
