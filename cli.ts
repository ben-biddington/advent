/**
 * tsc --build && node dist/cli.js
 */
import { Command }  from 'commander'
import * as fs from 'fs';

const program = new Command();


program.
  name('node dist/cli.js').
  version('0.0.1');

//
//  $ ./build && node dist/cli.js one
//
program.
  command("one").
  action(async () => {
    // [!] using internet toget input requires auth -- "Puzzle inputs differ by user.  Please log in to get your puzzle input"
    // https://adventofcode.com/2021/day/1/input
    
    // Why do e get NaNs?

    const input: number[] = fs.readFileSync('./input/one/input').toString()
      .split('\n')
      .map(it => it.trim())
      .map(it => parseInt(it));
    
    const increases = input.filter((value, index) => {
      if (index === 0)
        return false;
      
      const isIncrease = input[index] > input[index - 1];

      if (isIncrease) {
        console.log(`${input[index]} > ${input[index - 1]}`);
      }

      return isIncrease;
    });

    console.log(`Found <${increases.length}/${input.length}> increases`); /** 1557 is correct */
  });

program.parse(process.argv);

