"use client";
import { Box, Button, Heading, useToast } from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import { format } from "date-fns";
import { Spacer } from "./lib/Spacer";
import { useTransition } from "react";
interface Props {
  workout: Workout & {
    WorkoutType: WorkoutType | null;
    User?: User | null;
  };
  deleteWorkout?: () => Promise<void>;
}

export const WorkoutView = ({ workout, deleteWorkout }: Props) => {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();

  async function handleDelete() {
    startTransition(async () => {
      if (typeof deleteWorkout === "function") {
        await deleteWorkout();
      }
      toast({
        duration: 5000,
        title: "Trening slettet",
        status: "success",
      });
    });
  }

  return (
    <Box key={workout.id} border="1px solid black" padding="5">
      {workout.User ? (
        <Heading size="md">
          {workout.User?.nickname ?? workout.User?.name}
        </Heading>
      ) : null}
      <Heading size="sm">
        {format(workout.date, "yyyy: d. MMMM HH:mm")}:{" "}
        {workout.WorkoutType?.name}
      </Heading>

      {workout.WorkoutType?.hasLength ? (
        <Box>Varighet: {workout.length} minutter</Box>
      ) : null}

      {workout.WorkoutType?.hasIterations ? (
        <Box>Antall repitisjoner: {workout.iterations}</Box>
      ) : null}
      <Spacer />
      <Box>
        <strong>{workout.points}</strong> poeng
      </Box>
      <Spacer />
      {typeof deleteWorkout === "function" ? (
        <Button
          disabled={isPending}
          backgroundColor="red"
          color="white"
          onClick={handleDelete}
        >
          Slette trening
        </Button>
      ) : null}
    </Box>
  );
};
