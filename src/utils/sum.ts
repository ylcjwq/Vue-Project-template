const formatter = (num: number) => num.toFixed(2);

export function sum(a: number, b: number) {
  return a + b;
}

export function multiply(a: number, b: number) {
  const result = a * b;
  return formatter(result);
}
