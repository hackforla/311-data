import React from 'react';

const StaticFooter = () => (
  <>
    <div className="static-footer level-left">
      &copy; 2020 311 Data
      &nbsp; | &nbsp;
      All Rights Reserved
      &nbsp; | &nbsp;
      Powered by&nbsp;
      <span className="empowerla">EmpowerLA</span>
    </div>
    <div className="static-footer level-right">
      {/* **** NEED TO REPLACE HREF WITH VALID LINK WHEN AVAILABLE **** */}
      <a href="/">Terms & Conditions</a>
      &nbsp; | &nbsp;
      {/* **** NEED TO REPLACE HREF WITH VALID LINK WHEN AVAILABLE **** */}
      <a href="/">Privacy Policy</a>
    </div>
  </>
);

export default StaticFooter;
