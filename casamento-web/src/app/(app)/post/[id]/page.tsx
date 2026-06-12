"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError } from "@/lib/utils";
import PostCard from "@/components/feed/PostCard";
import CommentSection from "@/components/feed/CommentSection";
import type { Post } from "@/types";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Post>(`/api/posts/${id}`)
      .then(({ data }) => setPost(data))
      .catch((err) => toast.error(apiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-center text-ink-soft py-16 text-sm">Carregando...</p>;
  }
  if (!post) {
    return <p className="text-center text-ink-soft py-16 text-sm">Post não encontrado.</p>;
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => router.back()}
        className="label-luxe hover:text-primary transition"
      >
        ← Voltar
      </button>
      <PostCard post={post} onDeleted={() => router.replace("/feed")} />
      <CommentSection postId={post.id} />
    </div>
  );
}
