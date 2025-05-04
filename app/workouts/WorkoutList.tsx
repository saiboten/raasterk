"use client";
import { WorkoutView } from "@/components/WorkoutView";
import { Box, Button, Flex } from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Props {
  initialWorkouts: Array<
    Workout & {
      WorkoutType: WorkoutType | null;
      User?: User | null;
    }
  >;
  loadWorkouts: (index: number) => Promise<
    Array<
      Workout & {
        WorkoutType: WorkoutType | null;
        User?: User | null;
      }
    >
  >;
}

export function WorkoutsList({ initialWorkouts, loadWorkouts }: Props) {
  const [index, setIndex] = useState(0);
  const [workouts, setWorkouts] = useState(initialWorkouts);

  return (
    <>
      <Box>Side {index + 1}</Box>
      <Flex
        maxWidth="320px"
        justifyContent="center"
        gap="1rem"
        margin="1rem auto"
      >
        <Button
          isDisabled={index <= 0}
          onClick={async () => {
            const newIndex = index - 1;
            setIndex(newIndex);
            const newWorkouts = await loadWorkouts(newIndex);
            setWorkouts(newWorkouts);
          }}
        >
          <ArrowLeft />
        </Button>
        <Button
          isDisabled={workouts.length === 0}
          onClick={async () => {
            const newIndex = index + 1;
            setIndex(newIndex);
            const newWorkouts = await loadWorkouts(newIndex);
            setWorkouts(newWorkouts);
          }}
        >
          <ArrowRight />
        </Button>
      </Flex>
      <Flex textAlign="left" flexDirection="column" gap="2">
        {workouts.map((workout) => {
          return <WorkoutView key={workout.id} workout={workout}></WorkoutView>;
        })}
      </Flex>
    </>
  );
}
