import { Box, Flex, Heading } from "@chakra-ui/react";
import { User, Workout, WorkoutType } from "@prisma/client";
import { WorkoutView } from "./WorkoutView";

interface Props {
  lastFive: (Workout & {
    WorkoutType: WorkoutType | null;
    User: User | null;
  })[];
}

export const WorkoutNewsFeed = ({ lastFive }: Props) => {
  if (lastFive.length === 0) {
    return null;
  }

  return (
    <Box>
      <Heading size="md" mb="5">
        Siste treninger denne måneden
      </Heading>
      <Flex textAlign="left" flexDirection="column" gap="2">
        {lastFive.map((workout) => {
          return <WorkoutView key={workout.id} workout={workout}></WorkoutView>;
        })}
      </Flex>
    </Box>
  );
};
