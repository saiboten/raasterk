import { prisma } from "@/lib/prisma";
import { getUserId } from "./getUserId";
import {
  addDays,
  addMonths,
  endOfMonth,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Workout } from "@prisma/client";

const getDaysInMonth = (monthStart: Date, monthEnd: Date): number[] => {
  const returnList = [];
  let currentDate = monthStart;

  while (currentDate < monthEnd) {
    returnList.push(currentDate.getDate());
    currentDate = addDays(currentDate, 1);
  }

  return returnList;
};

export async function loadScore() {
  const userId = await getUserId();
  const workoutsUser = await prisma.workout.findMany({
    where: {
      userId: userId,
    },
  });

  const sum = workoutsUser.reduce((sum, next) => {
    return next.points + sum;
  }, 0);

  return sum;
}

export async function loadHomeData() {
  const userId = await getUserId();
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

  const myWorkoutsLastMonth = await prisma.workout.findMany({
    where: {
      date: {
        gte: lastMonthStart,
        lte: lastMonthEnd,
      },
      userId,
    },
  });

  const scoreThisTimeLastMonth = myWorkoutsLastMonth
    .filter((workout) => isBefore(addMonths(workout.date, 1), new Date()))
    .reduce((a, b) => a + b.points, 0);

  const allWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      User: true,
      WorkoutType: true,
    },
  });

  const lastFive = allWorkouts.reverse().slice(0, 3);

  return {
    // user data
    hasWorkedOutToday: !!allWorkouts
      .filter((el) => el.User?.id === userId)
      .find((el) => isToday(el.date)),
    lastFive,
    scoreThisTimeLastMonth,
  };
}

interface UserWorkoutMap {
  [id: string]: number;
}

export async function totalScoreChart(input: number) {
  "use server";
  const monthStart = startOfMonth(addMonths(new Date(), input));
  const monthEnd = endOfMonth(addMonths(new Date(), input));

  const allWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      User: true,
      WorkoutType: true,
    },
  });

  const totalScoresMap = allWorkouts.reduce((sum: UserWorkoutMap, workout) => {
    sum[workout.User?.nickname ?? workout.User?.name ?? ""] =
      (sum[workout.User?.nickname ?? workout.User?.name ?? ""] ?? 0) +
      workout.points;
    return sum;
  }, {});

  const totalScores = Object.keys(totalScoresMap)
    .map((key) => ({
      name: key,
      totalScore: totalScoresMap[key] ?? 0,
    }))
    .sort((k, p) => (p.totalScore > k.totalScore ? 1 : -1));

  return { totalScores, isEmpty: allWorkouts.length === 0 };
}

export async function loadWorkoutTypes() {
  return prisma.workoutType.findMany();
}

export async function getChartData(input: number) {
  "use server";
  const today = new Date();
  const monthStart = addMonths(startOfMonth(new Date()), input);
  const monthEnd = addMonths(endOfMonth(new Date()), input);

  const daysInMonth = getDaysInMonth(monthStart, monthEnd);

  const allWorkouts = await prisma.workout.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
    include: {
      User: true,
      WorkoutType: true,
    },
  });

  const workoutDict = allWorkouts.reduce(
    (sum: { [id: string]: Workout[] }, workout) => {
      const nameOrNick = workout.User?.nickname ?? workout.User?.name;
      if (nameOrNick === undefined || nameOrNick === null) {
        throw Error("Could not find user");
      }
      if (sum[nameOrNick] === undefined) {
        sum[nameOrNick] = [];
      }
      sum[nameOrNick]?.push(workout);
      return sum;
    },
    {}
  );

  const workoutChartData: {
    [id: string]: {
      dayNumber: number;
      scoreDay: number;
      scoreSum: number;
    }[];
  } = Object.keys(workoutDict).reduce((sum, user) => {
    let userScoreSum = 0;
    const result = daysInMonth.map((dayNumber) => {
      let score = 0;
      const day = addMonths(new Date(), input);
      day.setDate(dayNumber);

      workoutDict[user]?.filter((workout) => {
        if (isSameDay(workout.date, day)) {
          score += workout.points;
          userScoreSum += workout.points;
        }
      });
      return {
        dayNumber: dayNumber,
        scoreDay: score,
        scoreSum: userScoreSum,
      };
    });
    return {
      ...sum,
      [user]: result,
    };
  }, {});

  return {
    workoutChartData,
    daysInMonth,
    today,
    isEmpty: allWorkouts.length === 0,
  };
}

export type ChartData = Awaited<ReturnType<typeof getChartData>>;
