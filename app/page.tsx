import { Spacer } from "@/components/lib/Spacer";
import {
  getChartData,
  loadHomeData,
  loadScore,
  loadWorkoutTypes,
  totalScoreChart,
} from "./actions";
import { Sum } from "./Sum";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { FrontPageContent } from "./FrontPageContent";
import { WorkoutNewsFeed } from "@/components/WorkoutNewsFeed";
import { AddWorkoutLinks } from "@/components/AddWorkoutLinks";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const action = (await searchParams).action;

  const { hasWorkedOutToday, scoreThisTimeLastMonth, lastFive } =
    await loadHomeData();

  const workoutTypes = await loadWorkoutTypes();
  const initialChartData = await getChartData(0);
  const initialScoreData = await totalScoreChart(0);
  const score = await loadScore();

  return (
    <>
      {action === "addworkoutsuccess" ? (
        <>
          <Spacer />
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Trening lagret</AlertTitle>
            <AlertDescription>Godt jobbet!!!</AlertDescription>
          </Alert>
          <Spacer />
        </>
      ) : null}

      {!hasWorkedOutToday ? (
        <Box bgColor="khaki" padding="5" color="black" mb="5">
          Du har ikke samlet noen poeng i dag. På tide å komme seg opp på
          hesten!
        </Box>
      ) : null}

      <Text marginBottom="1rem">
        Siste måned på denne dagen hadde du{" "}
        <strong>{scoreThisTimeLastMonth} poeng</strong>
      </Text>

      <Sum score={score} />

      <FrontPageContent
        initialChartData={initialChartData}
        initialScoreData={initialScoreData}
        loadChartData={getChartData}
        getScoreData={totalScoreChart}
      />
      <WorkoutNewsFeed lastFive={lastFive} />

      <Spacer />

      <AddWorkoutLinks workoutTypes={workoutTypes} />
      <Spacer />
      <Link href="workouts">
        <Button colorScheme="orange">Se treninger</Button>
      </Link>
    </>
  );
}
