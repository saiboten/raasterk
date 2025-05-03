"use server";

import { getUserId } from "@/app/getUserId";
import { prisma } from "@/lib/prisma";
import { calculateScore } from "@/utils/score";
import { revalidatePath } from "next/cache";

export interface CreateWorkoutInput {
  workoutId: number;
  length?: number;
  iterations?: number;
}

export async function registerWorkout(input: CreateWorkoutInput) {
  const userId = await getUserId();
  const workOutType = await prisma.workoutType.findUnique({
    where: {
      id: input?.workoutId,
    },
  });

  if (!workOutType) {
    throw new Error("Could not find workout type");
  }

  const res = await prisma.workout.create({
    data: {
      date: new Date(),
      length: input?.length ?? 0,
      iterations: input?.iterations ?? 0,
      points: calculateScore(input, workOutType),
      userId: userId,
      workoutTypeId: input?.workoutId,
    },
  });

  revalidatePath("/");

  return res;
}

export type RegisterWorkoutOutput = Awaited<ReturnType<typeof registerWorkout>>;
