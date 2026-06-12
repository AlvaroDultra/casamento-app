"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/** Protege rotas: redireciona pro login se não estiver autenticado. */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { rehydrate, isAuthenticated } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    rehydrate();
    if (!useAuthStore.getState().isAuthenticated()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Carregando...
      </div>
    );
  }
  return <>{children}</>;
}
