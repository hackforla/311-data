import React from 'react'
import NCFilter from './NCFilter.jsx'
import DataPicker from './dataPicker.jsx'
import Legend from './Legend.jsx'
import Dropdown from '../../common/Dropdown';

const Header = () => (
  <section className="hero">
    <div className="hero-body">
      <div className="container">
        <h1 className="title">
          311 Data
        </h1>
        <h2 className="subtitle">
          Dashboard for NC
        </h2>
        <div className="columns">
          <div className="column">
            <Dropdown />
          </div>
          <div className="column">
            <NCFilter />
          </div>
          <div className="column">
            <DataPicker />
          </div>
        </div>
        <Legend />
      </div>
    </div>
  </section>
);

export default Header;
