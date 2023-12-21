type WordPatternCombo = [string, string];

function getPattern(guess: string, wordToGuess: string): string {
  let pattern: string = "";
  for (let index = 0; index < guess.length; index++) {
    if (guess[index] === wordToGuess[index]) {
      pattern += "2";
    } else if (wordToGuess.includes(guess[index])) {
      pattern += "1";
    } else {
      pattern += "0";
    }
  }
  return pattern;
}

// Function to cull a list based on word + pattern
function cullList(
  originalList: string[],
  guess: string,
  goal: string
): string[] {
  const pattern = getPattern(guess, goal);

  if (pattern.length !== 5 || guess.length !== 5) {
    console.error("error");
    return [];
  }

  let posString = "";
  let negString = "";
  let posMaybeString = "";
  let negMaybeString = "";

  for (let loc = 0; loc < pattern.length; loc++) {
    negString += pattern[loc] === "0" ? guess[loc] : "";
    posMaybeString += pattern[loc] === "1" ? `(?=.*${guess[loc]})` : "";
    negMaybeString += pattern[loc] === "1" ? `[^${guess[loc]}]` : ".";
    posString += pattern[loc] === "2" ? guess[loc] : ".";
  }

  const posRegex = new RegExp(`^${posString.toLowerCase()}$`);
  const negRegex = new RegExp(`^[^${negString.toLowerCase()}]{5}$` || "");
  const posMaybeRegex = new RegExp(`^${posMaybeString.toLowerCase()}.*$`);
  const negMaybeRegex = new RegExp(`^${negMaybeString.toLowerCase()}$`);

  //   if (log) {
  //     console.log(
  //       `word: ${guess}, ${pattern}\npositives: ${posString}, ${posRegex}\nnegatives: ${negString}, ${negRegex}\nmaybe so: ${posMaybeString}, ${posMaybeRegex}\nmaybe not: ${negMaybeString}, ${negMaybeRegex}\n`
  //     );
  //   }

  return originalList.filter(
    (word) =>
      posRegex.test(word) &&
      negRegex.test(word) &&
      posMaybeRegex.test(word) &&
      negMaybeRegex.test(word)
  );
}

// Function to repeatedly cull a list based on multiple word + pattern combos
function repeatedlyCullList(
  originalList: string[],
  guesses: string[],
  goal: string
): string[] {
  let culledList = originalList;

  for (const guess of guesses) {
    culledList = cullList(culledList, guess, goal);
  }

  return culledList;
}

type WordEntropy = [string, number];
type WordPatternDictionary = { [pattern: string]: number };

function rankByEntropy(wordList: string[]): WordEntropy[] {
  const wordPatternsWithCounts: WordPatternDictionary[] = Array.from(
    { length: wordList.length },
    () => ({})
  );

  // for every possible guess...
  for (let index = 0; index < wordList.length; index++) {
    const guess = wordList[index];
    // compare it to every possible answer
    for (const goal of wordList) {
      // with each comparison, get the pattern...
      const pattern = getPattern(guess, goal);
      wordPatternsWithCounts[index][pattern] =
        (wordPatternsWithCounts[index][pattern] || 0) + 1;
    }
  }

  const entropies: WordEntropy[] = [];

  // Calculate entropies using the dictionaries
  for (let index = 0; index < wordPatternsWithCounts.length; index++) {
    const wordPattern = wordPatternsWithCounts[index];
    entropies.push([wordList[index], calcEntrop(wordPattern, wordList.length)]);
  }

  // Sort the result array based on entropy
  const sortedEntropies = entropies.sort((a, b) => b[1] - a[1]);

  return sortedEntropies;
}

function calcEntrop(
  wordPatterns: WordPatternDictionary,
  totalWords: number
): number {
  

  let entropy_sum = 0;
  for (const pattern in wordPatterns) {
    const prob = wordPatterns[pattern] / totalWords;
    entropy_sum += prob * safeLog2(1 / prob);
  }

  return entropy_sum;
}

function safeLog2(x: number): number {
  return x > 0 ? Math.log2(x) : 0;
}

function probabilityToEntropy(probability: number): number {
  return safeLog2(1 / probability);
}

// Example usage:
// const wordList = ["apple", "banana", "cherry"];
// const result = rankByEntropy(wordList);
// console.log(result);

export { cullList, repeatedlyCullList, rankByEntropy, probabilityToEntropy };
