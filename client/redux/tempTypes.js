/* eslint-disable */
// This will be removed before launch. Just a quick way of testing
// different color palettes

import colors from '@theme/colors';

// Note: Colors defined here will render as the fill color in each of `Request Types` checkboxes.
const tempTypes = [
  {
    "typeId": 1,
    "typeName": "Graffiti",
    "agencyId": 4,
    "agencyName": "Office of Community Beautification",
    "color": colors.requestTypes.graffiti,
    "description": "Graffiti on walls/bulidings, unpainted concrete surfaces or metal posts"
  },
  {
    "typeId": 2,
    "typeName": "Homeless Encampment",
    "agencyId": 2,
    "agencyName": "Sanitation Bureau",
    "color": colors.requestTypes.homeless,
    "description": "Encampments impacting right-of-way or maintenance of clean and sanitary public areas"
  },
  {
    "typeId": 3,
    "typeName": "Animal Remains",
    "agencyId": 2,
    "agencyName": "Sanitation Bureau",
    "color": colors.requestTypes.animalRemains,
    "description": "Dead animal located on the streets or outside of residences"
  },
  {
    "typeId": 4,
    "typeName": "Bulky Items",
    "agencyId": 2,
    "agencyName": "Sanitation Bureau",
    "color": colors.requestTypes.bulkyItems,
    "description": "Chairs, desks, mattress and more..."
  },
  {
    "typeId": 5,
    "typeName": "Electronic Waste",
    "agencyId": 2,
    "agencyName": "Sanitation Bureau",
    "color": colors.requestTypes.eWaste,
    "description": "Computers, microwaves, laptops and more..."
  },
  {
    "typeId": 6,
    "typeName": "Illegal Dumping",
    "agencyId": 2,
    "agencyName": "Sanitation Bureau",
    "color": colors.requestTypes.illegalDumping,
    "description": "Disposing of garbage, waste and other matter on public or private property"
  },
  {
    "typeId": 7,
    "typeName": "Metal/Appliances",
    "agencyId": 2,
    "agencyName": "Sanitation Bureau",
    "color": colors.requestTypes.metalHouseholdAppliance,
    "description": "Air conditioners, dryers, refrigerator and more..."
  },
  {
    "typeId": 8,
    "typeName": "Single Streetlight",
    "agencyId": 1,
    "agencyName": "Street Lighting Bureau",
    "color": colors.requestTypes.singleStreetlight,
    "description": "Pole knocked down, streetlight outage on a wooden power pole, or malfunctioning traffic signal"
  },
  {
    "typeId": 9,
    "typeName": "Multiple Streetlights",
    "agencyId": 1,
    "agencyName": "Street Lighting Bureau",
    "color": colors.requestTypes.multiStreetlight,
    "description": "Multiple poles knocked down, streetlight outages on wooden power poles, or malfunctioning traffic signals"
  },
  {
    "typeId": 10,
    "typeName": "Water Waste",
    "agencyId": 1,
    "agencyName": "Street Lighting Bureau",
    "color": colors.requestTypes.waterWaste,
    "description": "Water runoff, over-watering, incorrect water days, or any other water waste "
  },
  {
    "typeId": 11,
    "typeName": "Feedback",
    "agencyId": 0,
    "agencyName": null,
    "color": colors.requestTypes.feedback,
    "description": "Either follow up on other issues or something that doesn't fit into the other types"
  },
  {
    "typeId": 12,
    "typeName": "Other",
    "agencyId": 0,
    "agencyName": null,
    "color": colors.requestTypes.other,
    "description": "Issues that do not fit into any of the other available types"
  },
];

export default tempTypes;
