"use client";

import { LoginForm } from "@/features/system/auth/components/common/login-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm 
      onSwitchToRegister={() => router.push("/register")}
    />
  );
}
