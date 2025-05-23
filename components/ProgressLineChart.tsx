import {
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryContainer,
} from "victory";
import { Loader } from "./lib/Loader";
import { ChartData } from "@/app/actions";
import { color } from "@/app/TotalScoreChart";

export const ProgressLineChart = ({
  chartData,
  month,
}: {
  month: number;
  chartData: ChartData | null;
}) => {
  if (chartData === null) {
    return <Loader />;
  }

  if (!chartData) {
    throw new Error("No data");
  }

  const { daysInMonth, workoutChartData, today, isEmpty } = chartData;

  const users = Object.keys(workoutChartData);

  if (isEmpty) {
    return null;
  }

  return (
    <>
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
          gutter={20}
          data={users.map((el, index) => ({
            name: el,
            symbol: { fill: color[index % color.length] },
          }))}
        />
        <VictoryAxis
          tickValues={daysInMonth.filter(
            (dayNumber) => month < 0 || dayNumber <= today.getDate()
          )}
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
              <VictoryLine
                key={index}
                data={workoutChartData[userName]
                  ?.filter((el) => month < 0 || el.dayNumber <= today.getDate())
                  ?.map((el) => ({
                    x: el.dayNumber,
                    y: el.scoreSum,
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
