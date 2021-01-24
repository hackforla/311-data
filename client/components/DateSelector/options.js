import { DateUtils } from 'react-day-picker';

const MMDD = 'MMDD';
const MMYYYY = 'MMYYYY';

const today = new Date();

const oneMonthBack = DateUtils.addMonths(new Date(), -1);
const sixMonthsBack = DateUtils.addMonths(new Date(), -6);
const twelveMonthsBack = DateUtils.addMonths(new Date(), -12);
const startOfThisYear = new Date(`1/1/${today.getFullYear()}`);
const oneWeekBack = new Date(new Date().setDate(today.getDate() - 7));

const convertDatesToFormattedString = (dates, format) => {
  const localeDateString = dates
    .map(date => date.toLocaleDateString('en-Us').split('/'))
    .map(dateArr => {
      const [day, month, year] = dateArr;
      if (format === MMYYYY) return [month, year].join('/');
      if (format === MMDD) return [month, day].join('/');
    });

  return localeDateString.join(' - ');
};

const options = [
  {
    text: `Last Week ( ${convertDatesToFormattedString(
      [oneWeekBack, today],
      MMDD,
    )})`,
    dates: [oneWeekBack, today],
  },
  {
    text: `Last Month (${convertDatesToFormattedString(
      [oneMonthBack, today],
      MMYYYY,
    )})`,
    dates: [oneMonthBack, today],
  },
  {
    text: `Last 6 months (${convertDatesToFormattedString(
      [sixMonthsBack, today],
      MMYYYY,
    )})`,
    dates: [sixMonthsBack, today],
  },
  {
    text: `Last 12 months (${convertDatesToFormattedString(
      [twelveMonthsBack, today],
      MMYYYY,
    )})`,
    dates: [twelveMonthsBack, today],
  },
  {
    text: `Year to Date (${convertDatesToFormattedString(
      [startOfThisYear, today],
      MMDD,
    )})`,
    dates: [startOfThisYear, today],
  },
];

export default options;
