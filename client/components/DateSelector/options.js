import { DateUtils } from 'react-day-picker';

const today = new Date();

const oneMonthBack = DateUtils.addMonths(today, -1);
const threeMonthsBack = DateUtils.addMonths(today, -3);
const oneWeekBack = new Date(new Date().setDate(today.getDate() - 7));

const options = [
  {
    text: 'Last Week',
    dates: [oneWeekBack, today],
  },
  {
    text: 'Last Month',
    dates: [oneMonthBack, today],
  },
  {
    text: 'Last 3 Months',
    dates: [threeMonthsBack, today],
  },
];

export default options;
