package com.casamento.domain.comment;

import com.casamento.domain.post.PostRepository;
import com.casamento.domain.user.User;
import com.casamento.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public List<CommentResponse> getByPost(UUID postId) {
        Map<UUID, User> authors = new HashMap<>();
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(c -> toResponse(c, authors))
                .toList();
    }

    public CommentResponse create(UUID postId, UUID authorId, String content) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post não encontrado");
        }
        Comment comment = Comment.builder()
                .postId(postId)
                .authorId(authorId)
                .content(content)
                .build();
        return toResponse(commentRepository.save(comment), new HashMap<>());
    }

    public void delete(UUID commentId, UUID currentUserId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentário não encontrado"));
        if (!comment.getAuthorId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode apagar seus próprios comentários");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c, Map<UUID, User> authorCache) {
        User author = authorCache.computeIfAbsent(c.getAuthorId(),
                id -> userRepository.findById(id).orElse(null));
        String nickname = author == null ? "convidado" : author.getNickname();
        String avatarUrl = author == null ? null : author.getAvatarUrl();
        return new CommentResponse(c.getId(), c.getPostId(), c.getAuthorId(),
                nickname, avatarUrl, c.getContent(), c.getCreatedAt());
    }

    public record CommentResponse(UUID id, UUID postId, UUID authorId, String authorNickname,
                                  String authorAvatarUrl, String content, Instant createdAt) {}
}
