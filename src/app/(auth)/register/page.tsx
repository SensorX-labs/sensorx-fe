"use client";

import { RegisterForm } from "@/features/system/auth/components";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterForm 
      onSwitchToLogin={() => router.push("/login")}
      onSubmit={(data : unknown) => {
        console.log("Register with:", data);
        // Add register logic here
      }}
    />
  );
}
