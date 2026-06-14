"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { apiError, formatWeddingDate } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { wedding } from "@/config/wedding";
import Ornament from "@/components/ui/Ornament";
import type { AuthResponse } from "@/types";

export default function WelcomePage() {
  const router = useRouter();
  const { setAuth, rehydrate, isAuthenticated } = useAuthStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    rehydrate();
    if (isAuthenticated()) router.replace("/feed");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>("/auth/guest", { nickname: name });
      setAuth(data.token, data.user);
      router.push("/feed");
    } catch (err) {
      toast.error(apiError(err, "Não foi possível entrar"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Cabeçalho do casal */}
        <div className="flex flex-col items-center mb-9 text-center">
          <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center bg-white/50 shadow-luxe-sm mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={wedding.logo} alt={wedding.coupleNames} className="w-16 h-16 object-contain" />
          </div>
          <p className="label-luxe mb-3">Nosso Casamento</p>
          <h1 className="font-display text-5xl font-semibold text-ink leading-none">
            {wedding.coupleNames}
          </h1>
          <Ornament className="my-4" />
          <p className="font-display italic text-lg text-primary-dark">
            {formatWeddingDate(wedding.weddingDate)}
          </p>
          <p className="text-sm text-ink-soft mt-1">{wedding.tagline}</p>
        </div>

        {/* Entrada só com o nome */}
        <div className="luxe-card p-7">
          <h2 className="font-display text-2xl text-ink mb-2 text-center">Como você se chama?</h2>
          <p className="text-sm text-ink-soft text-center mb-6">{wedding.welcomeMessage}</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-luxe block mb-2">Seu nome</label>
              <input
                type="text"
                required
                minLength={2}
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-luxe text-center text-base"
                placeholder="ex: Tia Ana"
              />
              <p className="text-xs text-ink-soft/70 mt-1.5 text-center">
                É como você vai aparecer nas fotos
              </p>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3 text-sm">
              {loading ? "Entrando..." : "Entrar na festa"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-5 text-ink-soft/70">
          Sem senha, sem cadastro — você fica conectado neste aparelho. 💛
        </p>
      </div>
    </div>
  );
}
