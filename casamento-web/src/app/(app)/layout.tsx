import AuthGuard from "@/components/ui/AuthGuard";
import Header from "@/components/layout/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Header />
        <main className="max-w-xl mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
