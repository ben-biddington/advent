export const sum = (array: number[]) => array.reduce((a,b) => a + b, 0);
export const range = (from: number, length: number): number[] => {
  const to = from + length;

  const result = [];

  for (let index = from; index < to; index++) {
    result.push(index);    
  }

  return result;
}