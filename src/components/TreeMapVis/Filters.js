import React from 'react';
// import DateSlider from '../DateSlider/DateSlider.js';
const Filters = ({yearChange, sMonthChange, eMonthChange, targetYear, sMonth, eMonth}) => {
  const months = [
    {
      num:1,
      name:"January"
    },{
        num:2,
        name:"February"
    },{
      num:3,
      name:"March"
    },{
      num:4,
      name:"April"
    },{
      num:5,
      name:"May"
    },{
      num:6,
      name:"June"
    },{
      num:7,
      name:"July"
    },{
      nunm:8,
      name:"August"
    },{
      num:9,
      name:"September"
    },{
      num:10,
      name:"October"
    },{
      num:11,
      name:"November"
    },{
      num:12,
      name:"December"
  }];

  const years = [2015, 2016, 2017, 2018, 2019];

  return (
    <div>
      Year
      <select id="yearSelection" className="data-dropdown" value={targetYear} onChange={yearChange}>
      {
        years.map(year => {
          return <option key={year} value={year}>{year}</option>
        })
      }
      </select>
      Start Month
      <select id="startMonthSelection" className="data-dropdown" value={sMonth} onChange={sMonthChange}>
      {
        months.map(month => {
          return <option key={month.name} value={month.num}>{month.name}</option>
        })
      }
      </select>
      <br/>
      End Month
      <select id="endMonthSelection" className="data-dropdown" value={eMonth} onChange={eMonthChange}>
      {
        months.map(month => {
          return <option  key={month.name} value={month.num}>{month.name}</option>
        })
      }
      </select>
  </div>
);
}
export default Filters;
