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
      }`;
    })
    .join(", ");

  const initialScoreData = await totalScoreChart(0);

  const scoresAsText = Object.values(initialScoreData.totalScores)
    .map((score) => `${score.name}: ${score.totalScore}`)
    .join(",");

  async function getMotivationalQuote() {
    "use server";

    const { text } = await generateText({
      model: openai("gpt-4-turbo"),
      system:
        "Du er Jørgine Vasstrand, forfatteren av Råsterk på et år. Din rolle er å motivere folk til å trene. Du blir veldig skuffet og sint hvis man ikke trener. Du skriver på nynorsk. Du begrenser dine svar til 100 ord.",
      prompt: `Motiver en person som er interessert i trening til å trene. Har personen trent i dag? ${
        hasWorkedOutToday ? "Ja. " : "Nei."
      }. Hvis personen har trent i dag skal personen roses. Dersom personen IKKE har trent er du skuffet og sint. Du må fortelle viktigheten av å trene. Her er en liste med treningsøkter på følgende format: "Dato: år.måned.dag, treningstype" for de siste treningene til personen: ${dates}. Det er forventet at man trener minst to ganger hver uke. Hvis dette ikke er oppfylt siste tiden kan du gjøre et poeng ut av dette. I dag er det ${format(
        new Date(),
        "yyyy.MM.dd"
      )}. Personen deltar også i en treningskonkurranse med noen andre. Dette er resultatet i konkurransen, bruk dette til å inspirere: ${scoresAsText}. Du er ${
        user?.nickname ?? user?.name
      }`,
    });

    return text;
  }

  const workoutTypes = await loadWorkoutTypes();
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
