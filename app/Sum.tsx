"use client";
import { Text } from "@chakra-ui/react";

export function Sum({ score }: { score: number }) {
  return (
    <Text>
      Sum totalt alle måneder: <strong>{score ?? 0} poeng</strong>
    </Text>
  );
}
