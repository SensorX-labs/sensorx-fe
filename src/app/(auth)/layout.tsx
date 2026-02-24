import { ReactNode } from "react";
import ClientHeader from "@/layouts/client/client-header";
import ClientFooter from "@/layouts/client/client-footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <ClientHeader />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <ClientFooter />
    </div>
  );
}
