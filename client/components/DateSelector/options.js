import { DateUtils } from 'react-day-picker';

const today = new Date();

const oneMonthBack = DateUtils.addMonths(new Date(), -1);
const sixMonthsBack = DateUtils.addMonths(new Date(), -6);
const twelveMonthsBack = DateUtils.addMonths(new Date(), -12);
const startOfThisYear = new Date(`1/1/${today.getFullYear()}`);
const oneWeekBack = new Date(new Date().setDate(today.getDate() - 7));

const getMonthsLongName = (...dates) => {
  const months = dates.map(date => date.toLocaleString('default', {
    month: 'long',
  }));
  return months.join(' - ');
};

const formatDateToMMDD = (...dates) => {
  const localeStringWithoutYear = dates
    .map(date => date.toLocaleDateString('en-Us').split('/'))
    .map(dateArr => {
      const [day, month] = dateArr;
      return [day, month].join('/');
    });

  return localeStringWithoutYear.join(' - ');
};

const options = [
  {
    text: `Last Week ( ${formatDateToMMDD(today, oneWeekBack)})`,
    dates: { to: today, from: oneWeekBack },
  },
  {
    text: `Last Month (${getMonthsLongName(oneMonthBack)})`,
    dates: { to: today, from: oneMonthBack },
  },
  {
    text: `Last 6 months (${getMonthsLongName(today, sixMonthsBack)})`,
    dates: { to: today, from: sixMonthsBack },
  },
  {
    text: `Last 12 months (${getMonthsLongName(today, twelveMonthsBack)})`,
    dates: { to: today, from: twelveMonthsBack },
  },
  {
    text: 'Year to Date',
    dates: { to: today, from: startOfThisYear },
  },
];

export default options;
