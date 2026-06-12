"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().rehydrate();
    if (useAuthStore.getState().isAuthenticated()) {
      router.replace("/feed");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Carregando...
    </div>
  );
}
