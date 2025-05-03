"use client";
import React, { useState, useTransition } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Spacer } from "../components/lib/Spacer";

interface Props {
  nickname?: string | null;
  changeNickName: (newNick: string) => Promise<void>;
}

export function AddNickName({ nickname: existingNick, changeNickName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [nickName, setNickName] = useState(existingNick ?? "");

  const toast = useToast();

  async function submitNickname(e: React.SyntheticEvent) {
    e.preventDefault();
    startTransition(async () => {
      await changeNickName(nickName);
      toast({
        title: "Brukernavn oppdatert.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    });
  }

  return (
    <>
      <Heading size="md">Velg brukernavn</Heading>
      <Spacer />

      {!existingNick ? <Text>Du ikke valgt kallenavn enda.</Text> : null}
      <Spacer />
      <form onSubmit={submitNickname}>
        <FormControl>
          <FormLabel htmlFor="nickname">
            {existingNick ? "Endre" : "Opprett"} brukernavn
          </FormLabel>
          <Flex>
            <Input
              mr="2"
              maxWidth="22rem"
              id="nickname"
              onChange={(e) => setNickName(e.target.value)}
              value={nickName}
              type="text"
            ></Input>
            <Button
              disabled={nickName.length < 3 || isPending}
              isLoading={isPending}
              type="submit"
            >
              Endre
            </Button>
          </Flex>
        </FormControl>
      </form>
      <Spacer />
    </>
  );
}
