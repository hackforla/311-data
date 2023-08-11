/* eslint-disable */
// This will be removed before launch. Just a quick way of testing
// different color palettes

import colors from '@theme/colors';

// For tempTypes below:
// 'orderId' is used to order items in main/TypeSelector/index.js.
// 'typeId' is the actual request ID value from server API.
//
// 'typeName' is used as the display title used in our application
// 'socrataNames' is an array of official names given to the request type by data.lacity.org
//  (we use an array here in case any name changes happen, we can account for it)

const requestTypes = [
  {
    orderId: 1,
    typeId: 3,
    typeName: 'Animal Remains',
    socrataNames: ['Dead Animal Removal'],
    agencyId: 2,
    agencyName: 'Sanitation Bureau',
    color: colors.requestTypes.animalRemains,
    description: 'Dead animal located on the streets or outside of residences',
  },
  {
    orderId: 2,
    typeId: 4,
    typeName: 'Bulky Items',
    socrataNames: ['Bulky Items'],
    agencyId: 2,
    agencyName: 'Sanitation Bureau',
    color: colors.requestTypes.bulkyItems,
    description: 'Chairs, desks, mattress and more...',
  },
  {
    orderId: 3,
    typeId: 5,
    typeName: 'Electronic Waste',
    socrataNames: ['Electronic Waste'],
    agencyId: 2,
    agencyName: 'Sanitation Bureau',
    color: colors.requestTypes.eWaste,
    description: 'Computers, microwaves, laptops and more...',
  },
  {
    orderId: 4,
    typeId: 1,
    typeName: 'Graffiti',
    socrataNames: ['Graffiti Removal'],
    agencyId: 4,
    agencyName: 'Office of Community Beautification',
    color: colors.requestTypes.graffiti,
    description:
      'Graffiti on walls/bulidings, unpainted concrete surfaces or metal posts',
  },
  {
    orderId: 5,
    typeId: 2,
    typeName: 'Homeless Encampment',
    socrataNames: ['Homeless Encampment'],
    agencyId: 2,
    agencyName: 'Sanitation Bureau',
    color: colors.requestTypes.homeless,
    description:
      'Encampments impacting right-of-way or maintenance of clean and sanitary public areas',
  },
  {
    orderId: 6,
    typeId: 6,
    typeName: 'Illegal Dumping',
    socrataNames: ['Illegal Dumping Pickup'],
    agencyId: 2,
    agencyName: 'Sanitation Bureau',
    color: colors.requestTypes.illegalDumping,
    description:
      'Disposing of garbage, waste and other matter on public or private property',
  },
  {
    orderId: 7,
    typeId: 7,
    typeName: 'Metal Appliances',
    socrataNames: ['Metal/Household Appliances'],
    agencyId: 2,
    agencyName: 'Sanitation Bureau',
    color: colors.requestTypes.metalHouseholdAppliance,
    description: 'Air conditioners, dryers, refrigerator and more...',
  },
  {
    orderId: 8,
    typeId: 9,
    typeName: 'Multiple Streetlights',
    socrataNames: ['Multiple Streetlight Issue'],
    agencyId: 1,
    agencyName: 'Street Lighting Bureau',
    color: colors.requestTypes.multiStreetlight,
    description:
      'Multiple poles knocked down, streetlight outages on wooden power poles, or malfunctioning traffic signals',
  },
  {
    orderId: 9,
    typeId: 8,
    typeName: 'Single Streetlight',
    socrataNames: ['Single Streetlight Issue'],
    agencyId: 1,
    agencyName: 'Street Lighting Bureau',
    color: colors.requestTypes.singleStreetlight,
    description:
      'Pole knocked down, streetlight outage on a wooden power pole, or malfunctioning traffic signal',
  },
  {
    orderId: 10,
    typeId: 10,
    typeName: 'Water Waste',
    socrataNames: ['Report Water Waste'],
    agencyId: 1,
    agencyName: 'Street Lighting Bureau',
    color: colors.requestTypes.waterWaste,
    description:
      'Water runoff, over-watering, incorrect water days, or any other water waste ',
  },
  {
    orderId: 11,
    typeId: 12,
    typeName: 'Feedback',
    socrataNames: ['Feedback'],
    agencyId: 0,
    agencyName: null,
    color: colors.requestTypes.feedback,
    description:
      "Either follow up on other issues or something that doesn't fit into the other types",
  },
  {
    orderId: 12,
    typeId: 11,
    typeName: 'Other',
    socrataNames: ['Other'],
    agencyId: 0,
    agencyName: null,
    color: colors.requestTypes.other,
    description: 'Issues that do not fit into any of the other available types',
  },
];

export default requestTypes;
