import React, { Component } from 'react';
import axios from 'axios';

import { getDataResources } from './Util/DataService';
import { REQUESTS, COUNCILS } from './components/common/CONSTANTS';

import Header from './components/main/header/Header';
import Body from './components/main/body/Body';
import Footer from './components/main/footer/Footer';

class App extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      year: '2015',
      startMonth: '1',
      endMonth: '12',
      request: REQUESTS[0],
      council: COUNCILS[0],
      showMarkers: false,
      showMarkersDropdown: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  updateState = (key, value, cb = () => null) => {
    this.setState({ [key]: value }, () => {
      this.fetchData(); // This is only for the dropdown component to fetch data on change
      cb();
    });
  }

  toggleShowMarkers = () => {
    const { showMarkers } = this.state;
    this.setState({ showMarkers: !showMarkers });
  }

  fetchData = () => {
    const dataUrl = this.buildDataUrl();

    axios.get(dataUrl)
      .then(({ data }) => {
        this.setState({ data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  buildDataUrl = () => {
    const {
      startMonth, endMonth, year, request,
    } = this.state;
    const dataResources = getDataResources();
    return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
  }

  render() {
    const { data, showMarkers, showMarkersDropdown } = this.state;

    return (
      <div className="main">
        <Header
          updateState={this.updateState}
          toggleShowMarkers={this.toggleShowMarkers}
          showMarkers={showMarkers}
          showMarkersDropdown={showMarkersDropdown}
        />
        <Body
          data={data}
          showMarkers={showMarkers}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
