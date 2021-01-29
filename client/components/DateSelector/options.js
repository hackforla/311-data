import { DateUtils } from "react-day-picker";

const today = new Date();

const oneMonthBack = DateUtils.addMonths(today, -1);
const sixMonthsBack = DateUtils.addMonths(today, -6);
const twelveMonthsBack = DateUtils.addMonths(today, -12);
const startOfThisYear = new Date(`1/1/${today.getFullYear()}`);
const oneWeekBack = new Date(new Date().setDate(today.getDate() - 7));

const options = [
  {
    text: `Last Week`,
    dates: [oneWeekBack, today],
  },
  {
    text: `Last Month`,
    dates: [oneMonthBack, today],
  },
  {
    text: `Last 6 months`,
    dates: [sixMonthsBack, today],
  },
  {
    text: `Last 12 months`,
    dates: [twelveMonthsBack, today],
  },
  {
    text: `Year to Date`,
    dates: [startOfThisYear, today],
  },
];

export default options;
