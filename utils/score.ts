import { CreateWorkoutInput } from "@/app/create/[id]/actions";
import { WorkoutType } from "@prisma/client";

export function calculateScore(
  workout: CreateWorkoutInput,
  workoutType: WorkoutType
): number {
  let sum = 0;

  if (workoutType.canBeCompleted) {
    sum += workoutType.completePoints ?? 0;
  }

  if (workoutType.hasLength) {
    sum += (workout?.length ?? 0) * (workoutType.lengthPoints ?? 0);
  }

  if (workoutType.hasIterations) {
    sum += (workout?.iterations ?? 0) * (workoutType.iterationsPoints ?? 0);
  }

  return sum;
}
