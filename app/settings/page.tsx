import { Heading } from "@chakra-ui/react";
import { AddNickName } from "@/components/AddNickName";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getUserId } from "../getUserId";
import { revalidatePath } from "next/cache";
import { LogOut } from "./Logout";

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
    revalidatePath("/");
    revalidatePath("/settings");
  }

  async function logout() {
    "use server";
    await signOut();
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
      <LogOut logout={logout} />
    </>
  );
}
