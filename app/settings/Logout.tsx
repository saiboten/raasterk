"use client";
import { signOut } from "@/auth";
import { Button } from "@chakra-ui/react";

export function LogOut() {
  return <Button onClick={() => signOut()}>Logg ut</Button>;
}
