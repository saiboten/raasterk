"use client";
import { Spacer } from "@/components/lib/Spacer";
import { Box, Heading } from "@chakra-ui/react";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import { ScoreData } from "./FrontPageContent";

export const color = ["chocolate", "darkcyan", "lightcoral"] as const;

interface Props {
  scoreData: ScoreData | null;
}

export function TotalScoreChart({ scoreData }: Props) {
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

      <VictoryChart domainPadding={{ x: 50 }}>
        <VictoryAxis />
        <VictoryBar
          x={"name"}
          y={"totalScore"}
          barWidth={50}
          labels={({ datum }) => `${datum.totalScore}`}
          data={totalScores.map((el, index) => ({
            ...el,
            fill: color[index % color.length],
          }))}
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
