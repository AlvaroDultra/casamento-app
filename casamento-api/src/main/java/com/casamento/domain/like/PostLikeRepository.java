package com.casamento.domain.like;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLike.PostLikeId> {
    long countByPostId(UUID postId);
    boolean existsByPostIdAndUserId(UUID postId, UUID userId);
    void deleteByPostIdAndUserId(UUID postId, UUID userId);
    List<PostLike> findByUserIdAndPostIdIn(UUID userId, Collection<UUID> postIds);
}
