export const sum = (array: number[]) => array.reduce((a,b) => a + b, 0);
export const range = (from: number, length: number): number[] => {
  const to = from + length;

  const result = new Array(to - from);

  console.log({from, to});

  for (let index = from; index <= to; index++) {
    result[index] = index;    
  }

  return result;
}