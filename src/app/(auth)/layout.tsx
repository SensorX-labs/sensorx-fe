import StoreFooter from "@/layouts/store/store-footer";
import StoreHeader from "@/layouts/store/store-header";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <StoreHeader/>
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <StoreFooter/>
    </div>
  );
}
