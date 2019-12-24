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
      timePeriod: '1 Month',
      request: REQUESTS[0],
      council: COUNCILS[0],
      showMarkers: false,
      showMarkersDropdown: true,
      link: undefined,
    };
  }

  componentDidMount() {
    // this.fetchData();
  }

  updateState = (key, value, cb = () => null) => {
    this.setState({ [key]: value }, () => {
      // this.fetchData(); // This is only for the dropdown component to fetch data on change
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
      startMonth, year, request, council, endMonth,
    } = this.state;

    const dataResources = getDataResources();
    const link = `https://data.lacity.org/resource/${dataResources[year]}.csv?$select=Address,count(*)+AS+CallVolume&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+RequestType='${request}'+and+NCName='${council}'&$group=Address&$order=CallVolume DESC&$limit=50000000`
    this.setState({ link });
    // return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
  }

  render() {
    const { 
      data, 
      startMonth, 
      endMonth, 
      link, 
    } = this.state;

    return (
      <div className="main">
        <Header />
        <Body
          data={data}
          startMonth={startMonth}
          endMonth={endMonth}
          link={link}
          buildUrl={this.buildDataUrl}
          updateState={this.updateState}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
