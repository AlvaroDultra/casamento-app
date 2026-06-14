"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError, timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { Post } from "@/types";

interface Props {
  post: Post;
  /** Mostra o botão de apagar quando o post é do usuário atual */
  onDeleted?: (id: string) => void;
}

export default function PostCard({ post, onDeleted }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [busy, setBusy] = useState(false);

  const isMine = currentUser?.id === post.author.id;
  const profileHref = `/profile/${post.author.id}`;

  async function toggleLike() {
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => c + (next ? 1 : -1));
    try {
      const { data } = await api.post<{ liked: boolean; likeCount: number }>(
        `/api/posts/${post.id}/like`
      );
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      setLiked(!next);
      setLikeCount((c) => c + (next ? -1 : 1));
      toast.error(apiError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Apagar este post?")) return;
    try {
      await api.delete(`/api/posts/${post.id}`);
      onDeleted?.(post.id);
      toast.success("Post apagado");
    } catch (err) {
      toast.error(apiError(err));
    }
  }

  return (
    <article className="luxe-card overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link href={profileHref} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full ring-1 ring-primary/25 bg-accent flex items-center justify-center overflow-hidden">
            {post.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-primary-dark font-semibold text-lg">
                {post.author.nickname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg text-ink font-semibold leading-none">
              {post.author.nickname}
            </p>
            <p className="text-xs text-ink-soft mt-0.5">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        {isMine && (
          <button onClick={handleDelete} className="text-ink-soft/50 hover:text-red-400 text-xs transition">
            Apagar
          </button>
        )}
      </div>

      {/* Mídia */}
      <Link href={`/post/${post.id}`} className="block bg-ink/95">
        {post.mediaType === "VIDEO" ? (
          <video
            src={post.mediaUrl}
            controls
            playsInline
            className="w-full max-h-[72vh] object-contain bg-ink"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.mediaUrl}
            alt={post.caption ?? "Foto do casamento"}
            className="w-full max-h-[72vh] object-contain bg-ink"
          />
        )}
      </Link>

      {/* Ações */}
      <div className="px-4 pt-3.5 flex items-center gap-5">
        <button onClick={toggleLike} className="flex items-center gap-1.5 group" aria-label="Curtir">
          <svg
            viewBox="0 0 24 24"
            className={`w-6 h-6 transition ${liked ? "fill-red-500 stroke-red-500" : "fill-none stroke-ink-soft group-hover:stroke-red-400"}`}
            strokeWidth="1.8"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-sm font-medium text-ink-soft">{likeCount}</span>
        </button>

        <Link href={`/post/${post.id}`} className="flex items-center gap-1.5 text-ink-soft hover:text-primary-dark transition">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="1.8">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span className="text-sm font-medium">{post.commentCount}</span>
        </Link>
      </div>

      {/* Legenda */}
      {post.caption ? (
        <p className="px-4 py-3 text-[0.95rem] text-ink/90 leading-relaxed">
          <Link href={profileHref} className="font-display font-semibold text-ink mr-1.5">
            {post.author.nickname}
          </Link>
          {post.caption}
        </p>
      ) : (
        <div className="pb-4" />
      )}
    </article>
  );
}
