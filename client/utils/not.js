export default function not(a, b, key) {
  return a.filter(itemA => !b.some(itemB => itemA[key] === itemB[key]));
}
