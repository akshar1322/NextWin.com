"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function NavUser() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p className="text-sm">Welcome, {session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-700 hover:text-black ml-2"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="text-sm text-gray-700 hover:text-black"
        >
          Login
        </button>
      )}
    </div>
  );
}
