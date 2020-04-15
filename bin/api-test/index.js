const dotenv = require('dotenv').config();
const axios = require('axios');
const tests = require('./tests');

////////////////// CONFIG /////////////////////

const API_URL = process.env.DB_URL;
const CALLS_PER_TEST = 5;

////////////////// HELPERS ////////////////////

async function promiseMapSeries(array, cb) {
	const results = new Array(array.length);
  for (let i = 0; i < array.length; i++) {
    results[i] = await cb(array[i], i);
  }
  return results;
}

function runTest(path, test) {
	console.log(test.description);
	let total = 0;
	return promiseMapSeries(Array(CALLS_PER_TEST), (_, idx) => {
		return axios.post(API_URL + path, test.params)
			.then(({ headers, data }) => {
				const performance = JSON.parse(headers['x-performance']);
				const time = +performance.executionTime;
				total += time;
				console.log(`#${idx + 1}: ${time} seconds`);
				console.log(typeof time);
			});
	})
		.then(() => ({
			[test.description]: +(total / CALLS_PER_TEST).toFixed(4),
		}));
}

function runTests(endpoints) {
	return promiseMapSeries(endpoints, endpoint => {
		console.log('\n' + endpoint.path);
		return promiseMapSeries(endpoint.tests, params => {
			return runTest(endpoint.path, params)
		}).then(results => ({
			path: endpoint.path,
			executionTimes: results.reduce((p, c) => {
				p = { ...p, ...c };
				return p;
			}, {}),
		}));
	});
}

///////////////////// MAIN /////////////////////

console.log(`\nRunning tests against: ${API_URL}.`)
runTests(tests).then(results => {
	console.log('\n' + JSON.stringify(results, null, 2));
});
