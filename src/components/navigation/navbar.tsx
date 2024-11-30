"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <nav className="fixed z-50 flex w-screen items-center justify-between p-1 px-5 md:px-10 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link href={"/"}>
          <Image
            src={"/tyche-logo.png"}
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </Link>
      </div>
      <div className="flex items-center gap-8 capitalize">
        <div className="hidden md:flex gap-8">
          <Link href={"#"}>
            <span className="underline-offset-4 hover:text-primary hover:underline">
              About
            </span>
          </Link>
          <Link href={"#"}>
            <span className="underline-offset-4 hover:text-primary hover:underline">
              Pricing
            </span>
          </Link>
        </div>
        <Button variant="muted" onClick={() => handleSignIn()}>
          <span>Sign in</span>
          <LogIn className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
