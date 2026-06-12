"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { wedding } from "@/config/wedding";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 bg-ivory/80 backdrop-blur-md border-b border-primary/15">
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wedding.logo} alt="" className="w-9 h-9 object-contain" />
          <span className="font-display text-xl font-semibold text-ink leading-none">
            {wedding.coupleNames}
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user && (
            <Link
              href={`/profile/${encodeURIComponent(user.nickname)}`}
              className="font-medium text-ink hover:text-primary-dark transition"
            >
              {user.nickname}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="label-luxe hover:text-primary transition"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
