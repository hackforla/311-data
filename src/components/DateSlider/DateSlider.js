// import React from 'react';
// import Picker from 'react-month-picker';
//
// const DateSlider = () => {
//   let pickerLang = {
//     months: ['Jan', 'Feb', 'Mar', 'Spr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//     , from: 'From', to: 'To'
//   }
//   , mvalue = {year: 2015, month: 11}
//   , mrange = {from: {year: 2014, month: 8}, to: {year: 2015, month: 5}}
//
//   let makeText = m => {
//     if (m && m.year && m.month) return (pickerLang.months[m.month-1] + '. ' + m.year)
//     return '?'
//   }
//
//   const handleRangeChange = () =>{
//
//   };
//   const handleRangeDismiss = () =>{
//
//   };
//   return (
//     <div className="edit">
//     <label>Pick A Span of Months</label>
//         <Picker
//             ref="pickRange"
//             years={{min: 2015, max: 2018}}
//             range={mrange}
//             lang={pickerLang}
//             theme="dark"
//             onChange={handleRangeChange}
//             onDismiss={handleRangeDismiss}
//             >
//
//         </Picker>
//     </div>
//   );
// }
//
//
// //
// //
// // class DateSlider extends React.Component {
// //   constructor(props) {
// //     super(props);
// //
// //     this.state = {
// //       value: { min: 0, max: 13 },
// //     };
// //   }
// //   render(){
// //   return (
// //       <InputRange
// //         maxValue={13}
// //         minValue={0}
// //         value={this.state.value}
// //         onChange={this.props.onSliderChange} />
// //     );
// //   }
// // }
// export default DateSlider;
// //
// // //
// // //
// // // const DateSlider = (label) => {
// // //   return (
// // //     <div class="slidecontainer">
// // //       <p>{label}:</p>
// // //       <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
// // //     </div>
// // //   );
// // // }
