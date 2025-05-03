"use client";
import { Spacer } from "@/components/lib/Spacer";
import { Box, Heading } from "@chakra-ui/react";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import { ScoreData } from "./FrontPageContent";

const color = ["chocolate", "darkcyan"];

interface Props {
  scoreData: ScoreData | null;
}

export function TotalScore({ scoreData }: Props) {
  if (scoreData === null) {
    return null;
  }

  const { totalScores, isEmpty } = scoreData;

  if (isEmpty) {
    return (
      <Box bgColor="khaki" padding="1rem">
        Det er ingen som har samlet poeng denne måneden! Hva skjer?!
      </Box>
    );
  }

  return (
    <>
      <Heading size="md">Stillingen</Heading>
      <Spacer />

      <VictoryChart>
        <VictoryAxis />
        <VictoryBar
          x={"name"}
          y={"totalScore"}
          barWidth={100}
          labels={({ datum }) => `${datum.totalScore}`}
          data={totalScores.map((el, index) => ({ ...el, fill: color[index] }))}
          domain={{ x: [0, 3] }}
          style={{
            data: {
              fill: ({ datum }) => datum.fill,
            },
          }}
        />
      </VictoryChart>
    </>
  );
}
