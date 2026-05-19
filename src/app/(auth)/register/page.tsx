"use client";

import { RegisterForm } from "@/features/system/auth/components/common/register-form";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterForm 
      onSwitchToLogin={() => router.push("/login")}
    />
  );
}
