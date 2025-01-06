const formatter = (num: number) => num.toFixed(2);

export const sum = (a: number, b: number) => {
  return a + b;
};

export const multiply = (a: number, b: number) => {
  const result = a * b;
  return formatter(result);
};
