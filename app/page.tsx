import { Spacer } from "@/components/lib/Spacer";
import {
  getChartData,
  getUser,
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
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import Link from "next/link";
import { AIMotivator } from "./AIMotivator";
import { format } from "date-fns";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const action = (await searchParams).action;

  const { hasWorkedOutToday, scoreThisTimeLastMonth, lastFive, workouts } =
    await loadHomeData();

  const user = await getUser();

  const dates = workouts
    .map((el) => {
      return `Dato: ${format(el.date, "yyyy.MM.dd")}, trening: ${
        el.WorkoutType?.name ?? "ukjent"
      }, ${el.points}`;
    })
    .join(", ");

  const initialScoreData = await totalScoreChart(0);

  const scoresAsText = Object.values(initialScoreData.totalScores)
    .map((score) => `${score.name}: ${score.totalScore}`)
    .join(",");

  const workoutTypes = await loadWorkoutTypes();

  const workoutTypesString = workoutTypes
    .map((el) => JSON.stringify(el))
    .join(", ");
  async function getMotivationalQuote() {
    "use server";

    const { text } = await generateText({
      model: openai("o4-mini"),
      system: "Du er en treningsmotivator. Begrens svar til 100 ord.",
      prompt: `Jeg ønsker å trene to ganger i uken. ${
        hasWorkedOutToday
          ? "Jeg har trent i dag og fortjener ros."
          : "Jeg har ikke trent i dag, noe som gjør deg opprørt."
      }. Liste med treningsøkter, format: "Dato: år.måned.dag, treningstype, poeng": ${dates}. I dag er det ${format(
        new Date(),
        "yyyy.MM.dd"
      )}. Jeg deltar i en treningskonkurranse. Her er info om hvordan man kan få poeng: ${workoutTypesString}. Dette er stillingen i konkurransen, bruk dette til å inspirere meg: ${scoresAsText}. Dette er hvordan man får poeng:  Jeg heter ${
        user?.nickname ?? user?.name
      }. Bruk denne infoen til å foreslå hvordan man kan komme først i konkurransen.`,
    });

    return text;
  }

  const initialChartData = await getChartData(0);

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

      <AIMotivator getMotivationalQuote={getMotivationalQuote} />

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
