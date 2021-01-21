import { DateUtils } from "react-day-picker";

const today = new Date();

const one_month_back = DateUtils.addMonths(new Date(), -1);
const six_months_back = DateUtils.addMonths(new Date(), -6);
const twelve_months_back = DateUtils.addMonths(new Date(), -12);
const start_of_this_year = new Date(`1/1/${today.getFullYear()}`);
const one_week_back = new Date(new Date().setDate(today.getDate() - 7));

const getMonthsLongString = (...dates) => {
  const months = dates.map((date) =>
    date.toLocaleString("default", {
      month: "long",
    })
  );
  return months.join(" - ");
};

const get_MMDD_String = (...dates) => {
  const localeStringWithoutYear = dates
    .map((date) => date.toLocaleDateString("en-Us").split("/"))
    .map((dateArr) => {
      const [day, month, year] = dateArr;
      return [day, month].join("/");
    });

  return localeStringWithoutYear.join(" - ");
};

const options = [
  {
    text: `Last Week ( ${get_MMDD_String(today, one_week_back)})`,
    dates: { to: today, from: one_week_back },
  },
  {
    text: `Last Month (${getMonthsLongString(one_month_back)})`,
    dates: { to: today, from: one_month_back },
  },
  {
    text: `Last 6 months (${getMonthsLongString(today, six_months_back)})`,
    dates: { to: today, from: six_months_back },
  },
  {
    text: `Last 12 months (${getMonthsLongString(today, twelve_months_back)})`,
    dates: { to: today, from: twelve_months_back },
  },
  {
    text: `Year to Date`,
    dates: { to: today, from: start_of_this_year },
  },
];

export default options;
