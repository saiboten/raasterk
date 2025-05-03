"use client";

import { Button, Flex, Text } from "@chakra-ui/react";
import { addMonths } from "date-fns";
import { useState } from "react";
import { TotalScoreChart } from "./TotalScoreChart";
import { Spacer } from "@/components/lib/Spacer";
import { ChartData } from "./actions";
import { OverviewChart } from "@/components/OverviewChart";
import { ProgressLineChart } from "@/components/ProgressLineChart";

const options1 = {
  year: "numeric",
  month: "long",
} as const;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const dateFormatter = new Intl.DateTimeFormat("nb-NO", options1);

interface Props {
  getScoreData: (input: number) => Promise<ScoreData>;
  loadChartData: (input: number) => Promise<ChartData>;
  initialScoreData: ScoreData;
  initialChartData: ChartData;
}

export interface ScoreData {
  totalScores: {
    name: string;
    totalScore: number;
  }[];
  isEmpty: boolean;
}

export function FrontPageContent({
  getScoreData,
  loadChartData,
  initialChartData,
  initialScoreData,
}: Props) {
  const [month, setMonth] = useState(0);
  const [scoreData, setScoreData] = useState<ScoreData>(initialScoreData);
  const [chartData, setChartData] = useState<ChartData>(initialChartData);

  const monthText = addMonths(new Date(), month);

  return (
    <>
      <Text fontSize={"1.5rem"}>
        {capitalize(dateFormatter.format(monthText))}
      </Text>
      <Flex
        justifyContent="flex-start"
        maxWidth="320px"
        marginTop="1rem"
        marginBottom="1rem"
      >
        <Button
          type="button"
          onClick={async () => {
            const newMonth = month - 1;
            setMonth(newMonth);
            const newScoreData = await getScoreData(newMonth);
            setScoreData(newScoreData);

            const newChartData = await loadChartData(newMonth);
            setChartData(newChartData);
          }}
        >
          Forrige måned
        </Button>
        <Button
          isDisabled={addMonths(new Date(), month + 1) > new Date()}
          marginLeft="1rem"
          type="button"
          onClick={async () => {
            const newMonth = month + 1;
            setMonth(newMonth);
            const newScoreData = await getScoreData(newMonth);
            setScoreData(newScoreData);

            const newChartData = await loadChartData(newMonth);
            setChartData(newChartData);
          }}
        >
          Neste måned
        </Button>
      </Flex>

      <TotalScoreChart scoreData={scoreData} />

      <Spacer />
      <OverviewChart chartData={chartData} />
      <Spacer />
      <ProgressLineChart month={month} chartData={chartData} />
      <Spacer />
    </>
  );
}
