import _debounce from 'lodash.debounce';
import settings from '@settings';

export default {};

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
