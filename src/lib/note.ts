import { endOfDay, fromUnixTime, subDays, subWeeks } from "date-fns";

type DateRange = {
  name: string;
  end: Date;
};

const today = new Date();
export const dateRanges: DateRange[] = [
  {
    name: "Today",
    end: endOfDay(today),
  },
  {
    name: "Previous 7 Days",
    end: endOfDay(subWeeks(today, 1)),
  },
  {
    name: "Previous 30 Days",
    end: subDays(endOfDay(today), 30),
  },
  {
    name: "Long ago",
    end: fromUnixTime(0),
  },
];
