let eventCounter = 0;

export function seededShuffle<T>(input: T[], seed: number): T[] {
  const arr = [...input];
  let s = seed >>> 0;

  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (1664525 * s + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export function nextEventId(): string {
  eventCounter += 1;
  return `event-${eventCounter.toString().padStart(5, "0")}`;
}
