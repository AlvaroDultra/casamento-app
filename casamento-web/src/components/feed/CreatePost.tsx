"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError } from "@/lib/utils";
import type { Post } from "@/types";

interface Props {
  onCreated: (post: Post) => void;
}

export default function CreatePost({ onCreated }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  // Aparelho com tela de toque (celular/tablet) → mostra o botão de câmera
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  function pickFile(f: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    setIsVideo(f.type.startsWith("video/"));
    setPreviewUrl(URL.createObjectURL(f));
  }

  function reset() {
    pickFile(null);
    setCaption("");
    if (cameraRef.current) cameraRef.current.value = "";
    if (galleryRef.current) galleryRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Escolha uma foto ou vídeo");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const endpoint = isVideo ? "/api/upload/video" : "/api/upload/image";
      const { data: media } = await api.post<{ url: string; mediaType: string }>(
        endpoint,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { data: post } = await api.post<Post>("/api/posts", {
        caption: caption.trim() || null,
        mediaUrl: media.url,
        mediaType: media.mediaType,
      });

      onCreated(post);
      reset();
      toast.success("Publicado! 🎉");
    } catch (err) {
      toast.error(apiError(err, "Não foi possível publicar"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxe-card p-4 mb-6">
      {!previewUrl ? (
        <div
          className="rounded-xl py-8 px-4 flex flex-col items-center gap-4"
          style={{ border: "1.5px dashed rgba(176,141,87,0.4)" }}
        >
          <div className="flex flex-col items-center gap-1 text-ink-soft">
            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-none stroke-current" strokeWidth="1.4">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.5" />
              <path d="M21 16l-5-5L5 19" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-display text-lg text-ink">Compartilhe um momento</p>
          </div>

          {isTouch ? (
            <div className="w-full flex gap-2.5">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="btn-gold flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Câmera
              </button>
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="flex-1 py-2.5 text-sm rounded-full border border-primary/40 text-primary-dark hover:bg-accent/60 transition flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Galeria
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => galleryRef.current?.click()}
              className="btn-gold px-6 py-2.5 text-sm"
            >
              Escolher foto ou vídeo
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {isVideo ? (
            <video src={previewUrl} controls className="w-full max-h-80 rounded-xl object-contain bg-ink" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="prévia" className="w-full max-h-80 rounded-xl object-contain bg-ink" />
          )}
          <button
            type="button"
            onClick={reset}
            className="absolute top-2 right-2 bg-ink/60 hover:bg-ink/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Câmera do celular (tira foto/vídeo na hora) */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />
      {/* Galeria / arquivos */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
      />

      {previewUrl && (
        <>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Escreva uma legenda (opcional)..."
            rows={2}
            className="input-luxe mt-3 resize-none"
          />
          <button type="submit" disabled={uploading} className="btn-gold w-full mt-2.5 py-3 text-sm">
            {uploading ? "Publicando..." : "Publicar"}
          </button>
        </>
      )}
    </form>
  );
}
