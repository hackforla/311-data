import React from 'react';
import { connect } from 'react-redux';

const Menu = ({

}) => {

  // const buildDataUrl = () => {
  //   return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
  // };

  return (
    <div>
      <h1>Menu</h1>
    </div>
  );
};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, null)(Menu);
