"use client";

import { LoginForm } from "@/features/auth/components";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginForm 
      onSwitchToRegister={() => router.push("/register")}
      onSubmit={(username, password) => {
        console.log("Login with:", username, password);
        // Add login logic here
      }}
    />
  );
}
