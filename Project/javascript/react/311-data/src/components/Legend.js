import React from 'react';
import {DiscreteColorLegend} from 'react-vis';
import './Legend.css'


const Legend = () => {
  const colorData = [
          {title: "Dead Animal Removal", color:"#FFB0AA"},
          {title: "Other",color:"#552900"},
          {title: "Homeless Encampment",color:"#427A82"},
          {title: "Single Streetlight Issue",color:"#D4726A"},
          {title: "Electronic Waste",color:"#69969C"},
          {title: "Feedback",color:"#82C38D"},
          {title: "Graffiti Removal",color:"#801D15"},
          {title: "Multiple Streetlight Issue",color:"#AA4139"},
          {title: "Metal/Household Appliances",color:"#D49D6A"},
          {title: "Illegal Dumping Pickup",color:"#804815"},
          {title: "Bulky Items",color:"#51A35F"},
          {title: "Report Water Waste",color:"#012E34"}
      ];

  return (
    <div className="Legend">
      <DiscreteColorLegend items={colorData} />
    </div>
        );
};

export default Legend;
