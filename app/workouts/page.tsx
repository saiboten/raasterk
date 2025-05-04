import { Button, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { WorkoutsList } from "./WorkoutList";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserId } from "../getUserId";
import { Spacer } from "@/components/lib/Spacer";
import { revalidatePath } from "next/cache";

export default async function Workouts() {
  async function loadWorkouts(index: number) {
    "use server";
    return (
      await prisma.workout.findMany({
        skip: index * 10,
        take: 10,
        where: {
          userId: await getUserId(),
        },
        include: {
          WorkoutType: true,
        },
      })
    ).sort((el1, el2) => (el1.date < el2.date ? 1 : -1));
  }

  async function deleteWorkout(workoutId: string) {
    "use server";

    await prisma.workout.delete({
      where: {
        id: workoutId,
        userId: await getUserId(),
      },
    });

    revalidatePath("/workouts");
    revalidatePath("/");
  }

  const workouts = await loadWorkouts(0);

  return (
    <>
      <Heading mb="5" size="lg">
        Treninger
      </Heading>
      <WorkoutsList
        deleteWorkout={deleteWorkout}
        initialWorkouts={workouts}
        loadWorkouts={loadWorkouts}
      />
      <Spacer />

      <Link href="/">
        <Button colorScheme="teal">
          <ArrowLeft /> Tilbake
        </Button>
      </Link>
    </>
  );
}
