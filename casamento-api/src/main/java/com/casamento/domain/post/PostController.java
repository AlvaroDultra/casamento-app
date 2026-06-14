package com.casamento.domain.post;

import com.casamento.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public Page<PostService.PostResponse> getFeed(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return postService.getFeed(PageRequest.of(page, size), idOrNull(user));
    }

    @GetMapping("/{id}")
    public PostService.PostResponse getPost(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return postService.getById(id, idOrNull(user));
    }

    @GetMapping("/user/{authorId}")
    public Page<PostService.PostResponse> getByAuthor(
            @AuthenticationPrincipal User user,
            @PathVariable UUID authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return postService.getByAuthor(authorId, PageRequest.of(page, size), idOrNull(user));
    }

    @PostMapping
    public ResponseEntity<PostService.PostResponse> createPost(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreatePostRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(user.getId(), req));
    }

    @PostMapping("/{id}/like")
    public PostService.LikeResponse toggleLike(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return postService.toggleLike(id, user.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        postService.deletePost(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    private UUID idOrNull(User user) {
        return user == null ? null : user.getId();
    }
}
