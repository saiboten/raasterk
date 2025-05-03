"use client";
import { Button } from "@chakra-ui/react";

interface Props {
  logout: () => Promise<void>;
}

export function LogOut({ logout }: Props) {
  return <Button onClick={logout}>Logg ut</Button>;
}
