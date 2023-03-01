export function limit(num) { //control extremes of depth range
    if (num < 0) {
      return 0;
    }
    if (num > 0.2) {
      return 0.2;
    }
    return num;
}