import { Heading } from "@chakra-ui/react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryGroup,
  VictoryLegend,
  VictoryContainer,
} from "victory";
import { ChartData } from "@/app/actions";
import { color } from "@/app/TotalScoreChart";

export const OverviewChart = ({
  chartData,
}: {
  chartData: ChartData | null;
}) => {
  if (chartData === null) {
    return null;
  }

  const { daysInMonth, workoutChartData, isEmpty } = chartData;

  const users = Object.keys(workoutChartData);

  if (isEmpty) {
    return null;
  }

  return (
    <>
      <Heading size="lg">Månedens treningspoeng</Heading>
      <VictoryChart
        containerComponent={
          <VictoryContainer
            style={{
              pointerEvents: "auto",
              touchAction: "auto",
              userSelect: "auto",
            }}
          />
        }
        domainPadding={5}
      >
        <VictoryLegend
          x={80}
          y={10}
          centerTitle
          orientation="horizontal"
          gutter={5}
          data={users.map((el, index) => ({
            name: el,
            symbol: { fill: color[index % color.length] },
          }))}
        />
        <VictoryAxis
          tickValues={daysInMonth}
          tickCount={15}
          style={{
            axisLabel: { fontSize: 20, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 15, padding: 5 },
          }}
        />
        <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
        <VictoryGroup
          colorScale={users.map(
            (el, index) => color[index % color.length] ?? "black"
          )}
          offset={4}
        >
          {users.map((userName, index) => {
            return (
              <VictoryBar
                barWidth={3}
                key={index}
                data={workoutChartData[userName]?.map((el) => ({
                  x: el.dayNumber,
                  y: el.scoreDay,
                }))}
                labels={({ datum }) => `${datum.y}`}
                labelComponent={
                  <VictoryTooltip flyoutHeight={20} style={{ fontSize: 10 }} />
                }
              />
            );
          })}
        </VictoryGroup>
      </VictoryChart>
    </>
  );
};
