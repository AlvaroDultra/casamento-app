"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError, formatWeddingDate } from "@/lib/utils";
import { wedding } from "@/config/wedding";
import Ornament from "@/components/ui/Ornament";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import type { Page, Post } from "@/types";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadedFirst = useRef(false);

  const loadMore = useCallback(async () => {
    if (loading || last) return;
    setLoading(true);
    try {
      const { data } = await api.get<Page<Post>>("/api/posts", {
        params: { page, size: 10 },
      });
      setPosts((prev) => (page === 0 ? data.content : [...prev, ...data.content]));
      setLast(data.last);
      setPage((p) => p + 1);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [page, last, loading]);

  useEffect(() => {
    if (loadedFirst.current) return;
    loadedFirst.current = true;
    loadMore();
  }, [loadMore]);

  function handleCreated(post: Post) {
    setPosts((prev) => [post, ...prev]);
  }

  function handleDeleted(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      {/* Cabeçalho elegante do mural */}
      <div className="text-center mb-7">
        <p className="font-display italic text-primary-dark text-lg">
          {formatWeddingDate(wedding.weddingDate)}
        </p>
        <Ornament className="my-3" />
        <p className="label-luxe">{wedding.hashtag}</p>
      </div>

      <CreatePost onCreated={handleCreated} />

      {posts.length === 0 && !loading ? (
        <div className="text-center text-ink-soft py-16">
          <p className="font-display text-2xl text-ink mb-1">Nenhum momento ainda</p>
          <p className="text-sm">Seja o primeiro a compartilhar uma lembrança 💛</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onDeleted={handleDeleted} />
          ))}
        </div>
      )}

      {!last && posts.length > 0 && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="block mx-auto mt-7 label-luxe hover:text-primary transition disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Ver mais"}
        </button>
      )}
    </div>
  );
}
