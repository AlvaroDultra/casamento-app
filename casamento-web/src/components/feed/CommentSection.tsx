"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError, timeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { Comment } from "@/types";

export default function CommentSection({ postId }: { postId: string }) {
  const currentUser = useAuthStore((s) => s.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api
      .get<Comment[]>(`/api/comments/post/${postId}`)
      .then(({ data }) => setComments(data))
      .catch((err) => toast.error(apiError(err)))
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    try {
      const { data } = await api.post<Comment>(`/api/comments/post/${postId}`, { content });
      setComments((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/api/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error(apiError(err));
    }
  }

  return (
    <div className="luxe-card p-5">
      <h3 className="font-display text-xl text-ink mb-4">
        Comentários {comments.length > 0 && <span className="text-ink-soft">({comments.length})</span>}
      </h3>

      {loading ? (
        <p className="text-sm text-ink-soft">Carregando...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-soft italic">Seja o primeiro a comentar 💬</p>
      ) : (
        <ul className="space-y-4 mb-5">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 group">
              <div className="w-9 h-9 rounded-full ring-1 ring-primary/20 bg-accent flex items-center justify-center shrink-0 overflow-hidden">
                {c.authorAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.authorAvatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-primary-dark text-sm font-semibold">
                    {c.authorNickname.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink/90 leading-relaxed">
                  <Link href={`/profile/${encodeURIComponent(c.authorNickname)}`} className="font-display font-semibold text-ink mr-1.5">
                    {c.authorNickname}
                  </Link>
                  {c.content}
                </p>
                <p className="text-xs text-ink-soft mt-0.5">{timeAgo(c.createdAt)}</p>
              </div>
              {currentUser?.id === c.authorId && (
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-ink-soft/40 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  apagar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-primary/15">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Adicione um comentário..."
          maxLength={1000}
          className="input-luxe flex-1 rounded-full"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="btn-gold px-5 text-sm shrink-0"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
