"use client";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from "@chakra-ui/react";
import { WorkoutType } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Spacer } from "./lib/Spacer";
import {
  CreateWorkoutInput,
  registerWorkout,
  RegisterWorkoutOutput,
} from "@/app/create/[id]/actions";
import { calculateScore } from "@/utils/score";

interface Values {
  length: string;
  type: WorkoutType;
  iterations: string;
}

interface Props {
  workoutType: WorkoutType;
  registerWorkout: (
    input: CreateWorkoutInput
  ) => Promise<RegisterWorkoutOutput>;
}

export const Register = ({ workoutType }: Props) => {
  const navigation = useRouter();
  const { control, handleSubmit, watch } = useForm<Values>({
    defaultValues: {
      iterations: "0",
      length: "0",
    },
  });

  const formSubmit = async (values: Values) => {
    const result = await registerWorkout({
      workoutId: workoutType.id,
      iterations: parseInt(values.iterations),
      length: parseInt(values.length),
    });
    if (result) {
      navigation.push("/?action=addworkoutsuccess"); // todo check if result is ok with useActionState or something
    }
  };

  const { iterations, length } = watch();

  const score = calculateScore(
    {
      workoutId: workoutType.id,
      iterations: parseInt(iterations) ?? 0,
      length: parseInt(length) ?? 0,
    },
    workoutType
  );

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Heading mb="5" size="lg">
        {workoutType.name}
      </Heading>
      <Spacer />
      <Box>Denne treningen gir en verdi på {score} poeng</Box>
      <Spacer />

      <FormControl mb="5">
        {workoutType.hasLength ? (
          <>
            <FormLabel>Lengde</FormLabel>
            <Controller
              name="length"
              control={control}
              render={({ field }) => (
                <NumberInput step={5} {...field}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            ></Controller>
          </>
        ) : null}
        {workoutType.hasIterations ? (
          <>
            <FormLabel>Antall reps</FormLabel>
            <Controller
              name="iterations"
              control={control}
              render={({ field }) => (
                <NumberInput step={5} {...field}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            ></Controller>
          </>
        ) : null}
        <Spacer />
        <Button
          type="submit"
          // isLoading={status === "loading"}
          // disabled={status === "loading" || score === 0}
        >
          Lagre
        </Button>
      </FormControl>
    </form>
  );
};
