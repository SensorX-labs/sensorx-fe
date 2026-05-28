"use client";

import { LoginForm } from "@/features/system/auth/components/common/login-form";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Suspense fallback={<div className="p-4 text-center">Đang tải...</div>}>
      <LoginForm 
        onSwitchToRegister={() => router.push("/register")}
      />
    </Suspense>
  );
}
