export function limit(num) { //control extremes of depth range
    return (num > 0) ? num : 0;
}

export function calcFrequency(depth) {
  return (20000 * depth);
}