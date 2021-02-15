import * as R from 'rambda';

export function allEquals(xs) {
  // Vacuous truth
  if (xs.length < 2) {
    return true;
  }
  let [head, ...tail] = xs;
  return R.all(R.equals(head), tail);
}
