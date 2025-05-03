import { Heading } from "@chakra-ui/react";
import { LogOut } from "./Logout";
import { AddNickName } from "@/components/AddNickName";
import { prisma } from "@/lib/prisma";
import { getUserId } from "../getUserId";

export default async function Settings() {
  async function changeNickName(newName: string) {
    "use server";
    await prisma?.user.update({
      where: {
        id: await getUserId(),
      },
      data: {
        nickname: newName,
      },
    });
  }

  async function loadNickName() {
    const user = await prisma.user.findUnique({
      where: {
        id: await getUserId(),
      },
    });
    return user?.nickname;
  }

  const existingNick = await loadNickName();

  return (
    <>
      <Heading mb="5" size="lg">
        Innstillinger
      </Heading>
      <AddNickName nickname={existingNick} changeNickName={changeNickName} />
      <LogOut />
    </>
  );
}
