"use client";

import { Spacer } from "@/components/lib/Spacer";
import { Button, Text } from "@chakra-ui/react";
import { useState, useTransition } from "react";

interface Props {
  getMotivationalQuote: () => Promise<string>;
}
export function AIMotivator({ getMotivationalQuote }: Props) {
  const [isPending, startTransition] = useTransition();
  const [quote, setQuote] = useState("");
  return (
    <>
      <Button
        isLoading={isPending}
        disabled={isPending}
        onClick={async () => {
          startTransition(async () => {
            const q = await getMotivationalQuote();
            setQuote(q);
          });
        }}
      >
        Bli motivert
      </Button>
      <Spacer />
      <Text>{quote}</Text>
    </>
  );
}
