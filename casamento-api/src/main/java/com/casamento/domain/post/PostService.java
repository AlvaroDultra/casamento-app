package com.casamento.domain.post;

import com.casamento.domain.comment.CommentRepository;
import com.casamento.domain.like.PostLike;
import com.casamento.domain.like.PostLikeRepository;
import com.casamento.domain.user.User;
import com.casamento.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostLikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public Page<PostResponse> getFeed(Pageable pageable, UUID currentUserId) {
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return mapPage(posts, currentUserId);
    }

    public Page<PostResponse> getByAuthor(String nickname, Pageable pageable, UUID currentUserId) {
        User author = userRepository.findByNicknameIgnoreCase(nickname)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convidado não encontrado"));
        Page<Post> posts = postRepository.findByAuthorIdOrderByCreatedAtDesc(author.getId(), pageable);
        return mapPage(posts, currentUserId);
    }

    public PostResponse getById(UUID id, UUID currentUserId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post não encontrado"));
        return toResponse(post, currentUserId);
    }

    public PostResponse createPost(UUID authorId, CreatePostRequest req) {
        Post post = Post.builder()
                .authorId(authorId)
                .caption(req.getCaption())
                .mediaUrl(req.getMediaUrl())
                .mediaType(req.getMediaType())
                .build();
        post = postRepository.save(post);
        return toResponse(post, authorId);
    }

    public void deletePost(UUID postId, UUID currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post não encontrado"));
        if (!post.getAuthorId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você só pode apagar seus próprios posts");
        }
        postRepository.delete(post);
    }

    @Transactional
    public LikeResponse toggleLike(UUID postId, UUID userId) {
        if (!postRepository.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Post não encontrado");
        }
        boolean liked;
        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            liked = false;
        } else {
            likeRepository.save(PostLike.builder().postId(postId).userId(userId).build());
            liked = true;
        }
        return new LikeResponse(liked, likeRepository.countByPostId(postId));
    }

    private Page<PostResponse> mapPage(Page<Post> posts, UUID currentUserId) {
        List<UUID> postIds = posts.stream().map(Post::getId).toList();
        Set<UUID> likedByMe = currentUserId == null || postIds.isEmpty()
                ? Set.of()
                : likeRepository.findByUserIdAndPostIdIn(currentUserId, postIds).stream()
                    .map(PostLike::getPostId).collect(Collectors.toSet());

        // Cache de autores para evitar N+1
        Map<UUID, User> authors = new HashMap<>();
        return posts.map(p -> {
            User author = authors.computeIfAbsent(p.getAuthorId(),
                    id -> userRepository.findById(id).orElse(null));
            return toResponse(p, author, likedByMe.contains(p.getId()));
        });
    }

    private PostResponse toResponse(Post post, UUID currentUserId) {
        User author = userRepository.findById(post.getAuthorId()).orElse(null);
        boolean liked = currentUserId != null
                && likeRepository.existsByPostIdAndUserId(post.getId(), currentUserId);
        return toResponse(post, author, liked);
    }

    private PostResponse toResponse(Post post, User author, boolean likedByMe) {
        AuthorDto authorDto = author == null
                ? new AuthorDto(post.getAuthorId(), "convidado", null)
                : new AuthorDto(author.getId(), author.getNickname(), author.getAvatarUrl());
        return new PostResponse(
                post.getId(),
                authorDto,
                post.getCaption(),
                post.getMediaUrl(),
                post.getMediaType(),
                post.getCreatedAt(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.countByPostId(post.getId()),
                likedByMe
        );
    }

    public record AuthorDto(UUID id, String nickname, String avatarUrl) {}

    public record PostResponse(UUID id, AuthorDto author, String caption, String mediaUrl,
                               String mediaType, Instant createdAt, long likeCount,
                               long commentCount, boolean likedByMe) {}

    public record LikeResponse(boolean liked, long likeCount) {}
}
