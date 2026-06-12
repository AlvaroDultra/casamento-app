"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError } from "@/lib/utils";
import Ornament from "@/components/ui/Ornament";
import PostCard from "@/components/feed/PostCard";
import type { Page, Post, User } from "@/types";

export default function ProfilePage() {
  const { nickname } = useParams<{ nickname: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const enc = encodeURIComponent(nickname);
    Promise.all([
      api.get<User>(`/api/users/${enc}`),
      api.get<Page<Post>>(`/api/posts/user/${enc}`, { params: { size: 50 } }),
    ])
      .then(([u, p]) => {
        setUser(u.data);
        setPosts(p.data.content);
      })
      .catch((err) => toast.error(apiError(err)))
      .finally(() => setLoading(false));
  }, [nickname]);

  function handleDeleted(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return <p className="text-center text-ink-soft py-16 text-sm">Carregando...</p>;
  }
  if (!user) {
    return <p className="text-center text-ink-soft py-16 text-sm">Convidado não encontrado.</p>;
  }

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full ring-1 ring-primary/30 bg-accent flex items-center justify-center overflow-hidden shadow-luxe-sm mb-4">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-primary-dark text-3xl font-semibold">
              {user.nickname.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <h1 className="font-display text-3xl text-ink font-semibold">{user.nickname}</h1>
        <Ornament className="my-3" />
        <p className="label-luxe">
          {posts.length} {posts.length === 1 ? "momento" : "momentos"}
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-ink-soft py-10 text-sm italic">
          Esse convidado ainda não compartilhou nada.
        </p>
      ) : (
        <div className="space-y-6">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
