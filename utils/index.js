import _debounce from 'lodash.debounce';
import settings from '@settings';
import requestTypes from '@root/data/requestTypes';

export default {};

function removeSpaces(str) {
  if (!!str === false || typeof str !== 'string') {
    return null;
  }

  return str.replace(/\s/g, '');
}

export function getTypeIdFromTypeName(typeNameParam = '') {
  // early return null if we have invalid criteria
  if (
    !!typeNameParam === false
    || typeof typeNameParam !== 'string'
    || !!requestTypes === false
    || requestTypes.length === 0
  ) {
    return null;
  }

  // requestTypes is an array of objects imported from @root/data/requestTypes.js
  // see if any of our known types are a substring of the input string
  // (because Socrata API can return something this: "Illegal Dumping Pickup"
  // which should match "Illegal Dumping")

  let subStr;
  const fullStr = removeSpaces(typeNameParam.toLowerCase().trim());

  // search for subStr within fullStr
  const requestObject = requestTypes.find(request => {
    subStr = removeSpaces(request.typeName.toLowerCase().trim());
    return fullStr.indexOf(subStr) >= 0;
  });

  // return the typeId of the request with matching typeNameParam or undefined if not found
  return requestObject?.typeId;
}

/*
  Given an object of counts, e.g. --
  {
    "Bulky Items": 50,
    "Graffiti Removal": 126,
    "Dead Animal Removal" 1
  }
  -- groups all keys with less than a given percentage in an "Other"
  category. Used in pie charts to prevent labels from overlapping.
*/
export function transformCounts(counts = {}) {
  // add to "Other" if a count has less than this percentage of total
  const MIN_PERCENTAGE = 1.0;

  const altCounts = {
    Other: 0,
  };

  const total = Object.values(counts).reduce((p, c) => p + c, 0);

  Object.keys(counts).forEach(key => {
    if (counts[key] / total >= MIN_PERCENTAGE / 100) {
      altCounts[key] = counts[key];
    } else {
      altCounts.Other += counts[key];
    }
  });

  if (altCounts.Other === 0) delete altCounts.Other;

  return altCounts;
}

// lodash debounce wrapper called with our settings values
export const debounce = func => _debounce(
  func,
  settings.map.debounce.duration,
  settings.map.debounce.options,
);

// utility to dispatch click event to toggle Bondaries SelectorBox
export const toggleBoundaries = () => {
  if (!!document === false) {
    return;
  }

  const button = document.getElementById('boundaries');
  const event = new Event('click', { bubbles: true });
  button.dispatchEvent(event);
};

// helper to create a javascript object from a key array and values array
// Example:
//  keys = [a,b,c]
//  vals = [1,2,3]
//
//  obj = createObjFromArrays({keysArray: keys, valArray: vals})
//
//  obj will be {a: 1, b: 2, c: 3}

export const createObjFromArrays = ({ keyArray = [], valArray = [] }) => {
  try {
    if (
      !!keyArray === false
      || !!valArray === false
      || keyArray.length === 0
      || valArray.length === 0
    ) {
      throw new Error('missing required parameters in function call');
    }

    const obj = valArray.reduce((acc, curr, i) => {
      acc[keyArray[i]] = curr;
      return acc;
    }, {});

    return obj;
  } catch (e) {
    console.error('createObjFromArrays: Error occurred: ', e);
    return undefined;
  }
};

// returns true if the value provided is empty
export function isEmpty(value) {
  // undefined, null, 0, false, NaN, empty strings are considered empty
  if (!!value === false) return true;

  // an object with no keys is considered empty
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return Object.keys(value).length === 0;
  }

  // an array with no values is considered empty
  if (Array.isArray(value)) return value.length === 0;

  // not empty
  return false;
}

export function truncateName(name, maxLen) {
  const nameLen = name.length;
  if (nameLen <= maxLen) {
    return name;
  }
  const ellipsisLen = 3;
  const charsToShow = maxLen - ellipsisLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  const truncatedName = `${name.slice(0, frontChars)}...${name.slice(
    nameLen - backChars,
  )}`;
  return truncatedName;
}

export function removeFromName(name, replaceStrings) {
  let cleanedName = name.toUpperCase();
  replaceStrings.forEach(str => {
    cleanedName = cleanedName.replace(str.toUpperCase(), '');
  });
  return cleanedName;
}

export function seconds(milliseconds = 0) {
  return milliseconds * 1000;
}

export function shuffle(array) {
  return array
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value);
}
