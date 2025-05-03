import { Wrapper } from "@/components/lib/Wrapper";
import { Register } from "@/components/Register";
import { prisma } from "@/lib/prisma";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { registerWorkout } from "./actions";

export default async function CreateWorkout({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const p = await params;
  const id = p.id;

  async function workoutTypeDetails(id: string) {
    const workout = await prisma.workoutType.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
    });

    return workout;
  }

  const workoutType = await workoutTypeDetails(id);

  return (
    <Wrapper>
      <Register workoutType={workoutType} registerWorkout={registerWorkout} />
      <ChakraLink href="/" as={NextLink}>
        Tilbake
      </ChakraLink>
    </Wrapper>
  );
}
