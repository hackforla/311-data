import { addMonths } from 'date-fns';

const today = new Date();

const oneMonthBack = addMonths(today, -1);
const threeMonthsBack = addMonths(today, -3);
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
