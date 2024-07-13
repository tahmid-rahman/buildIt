"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleLogin = () => {
    router.push("/login");
  };
  const handleLogout = () => {
    signOut();
  };
  return (
    <div className="h-screen">
      <div className="">
        {status !== "authenticated" ? (
          <>
            <h2 className="">Welcome to our website</h2>
            <hr className="" />
            <p className="">Please sign in or create an account to continue.</p>
            <button className="" onClick={handleLogin}>
              Sign In / Sign Up
            </button>
          </>
        ) : (
          <>
            <h2 className="">Welcome, {session.user.name}</h2>
            <hr className="" />
            <p className="">Email: {session.user.email}</p>
            <button className="" onClick={handleLogout}>
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
