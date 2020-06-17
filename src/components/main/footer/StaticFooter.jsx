import React from 'react';
import { Link } from 'react-router-dom';

const StaticFooter = () => (
  <footer className="navbar has-navbar-fixed-bottom">
    <div className="static-footer level-left">
      &copy;2020 311 Data
      &nbsp;|&nbsp;
      All Rights Reserved
      &nbsp;|&nbsp;
      Powered by&nbsp;
      <span className="empowerla">EmpowerLA</span>
    </div>
    <div className="static-footer level-right">
      <Link to="/privacy">Privacy Policy</Link>
    </div>
  </footer>
);

export default StaticFooter;
