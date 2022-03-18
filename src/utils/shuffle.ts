/* eslint-disable @typescript-eslint/ban-ts-comment */

export function shuffle<T>(items: T[]): T[] {
  let randomIndex;
  let temp;
  const shuffled = items.slice();
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    randomIndex = Math.floor(Math.random() * (index + 1));
    temp = shuffled[index];
    // @ts-ignore
    shuffled[index] = shuffled[randomIndex];
    // @ts-ignore
    shuffled[randomIndex] = temp;
  }

  return shuffled;
}
