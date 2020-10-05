
const NC_IDS = [ 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 50, 52, 53, 54, 55, 58, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 73, 74, 75, 76, 77, 78, 79, 80, 81, 84, 86, 87, 88, 90, 91, 92, 93, 94, 95, 96, 97, 99, 100, 101, 102, 104, 109, 110, 111, 112, 113, 114, 115, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128 ];
const CD_IDS = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
const REQUEST_TYPES = [ 'Dead Animal Removal', 'Homeless Encampment', 'Single Streetlight Issue', 'Multiple Streetlight Issue', 'Feedback', 'Bulky Items', 'Electronic Waste', 'Metal/Household Appliances', 'Graffiti Removal', 'Illegal Dumping Pickup', 'Other' ];

const small = {
	description: 'small',
	params: {
		startDate: '2019-01-01',
		endDate: '2019-02-01',
		ncList: [ 10, 42, 98 ],
		requestTypes: ['Bulky Items'],
		countFields: ['requesttype', 'requestsource'],
	},
};

const medium = {
	description: 'medium',
	params: {
		startDate: '2019-01-01',
		endDate: '2019-07-01',
		ncList: NC_IDS.slice(0, 50),
		requestTypes: REQUEST_TYPES.slice(0, 7),
		countFields: ['requesttype', 'requestsource'],
	},
};

const large = {
	description: 'large',
	params: {
		startDate: '2019-01-01',
		endDate: '2020-01-01',
		ncList: NC_IDS,
		requestTypes: REQUEST_TYPES,
		countFields: ['requesttype', 'requestsource'],
	},
};

module.exports = [
	{
		path: '/pins',
		tests: [
			small,
			medium,
			large,
		],
	},
	{
		path: '/timetoclose',
		tests: [
			small,
			medium,
			large,
		],
	},
	{
		path: '/requestfrequency',
		tests: [
			small,
			medium,
			large,
		],
	},
	{
		path: '/requestcounts',
		tests: [
			small,
			medium,
			large,
		],
	},
];
