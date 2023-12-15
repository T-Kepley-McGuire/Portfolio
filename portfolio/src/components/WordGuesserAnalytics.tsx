import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
// import { CSSTranitionGroup } from "react-transition-group";

import text from "../utilities/words";

import "../css/word-guesser-analytics.css";
import exp from "constants";

export default function WordGuesserAnalytics({
  guesses,
  word,
}: {
  guesses: string[];
  word: string[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [wordDivs, setWordDivs] = useState<ReactElement[]>([]);
  const [expanded, setExpanded] = useState<number>(-1);

  const [analyticsDiv, setAnalyticsDiv] = useState<ReactElement>();

  const [rankedWords, setRankedWords] =
    useState<{ key: string; value: number }[]>();

  useEffect(() => {
    const evalLists = getWordEvalListsFromGuesses(guesses, word);

    console.log("filtered list", checkAgainstFoundInfo(wordList, evalLists));
  }, [guesses, word]);

  const wordList = text.split("\n");

  const handleClick = (index: number) => {
    setExpanded(index);
  };

  useOutsideAlerter(wrapperRef, () => {
    setExpanded((last) => -1);
  });

  // useEffect(() => {
  //   if (!rankedWords) {
  //     const wordsThatElim: { [key: string]: number } = {};

  //     wordList.forEach((wordInQuestion) => {
  //       wordList.forEach((word) => {
  //         const wordAsArray = word.toUpperCase().split("");
  //         const eliminatedWordList = checkAgainstFoundInfo(
  //           wordList,
  //           getWordEvalListsFromGuesses(
  //             [word.toUpperCase()],
  //             wordInQuestion.toUpperCase().split("")
  //           )
  //         );

  //         if (wordsThatElim[word]) {
  //           wordsThatElim[word] =
  //             wordsThatElim[word] + eliminatedWordList.length / wordList.length;
  //         } else
  //           wordsThatElim[word] = eliminatedWordList.length / wordList.length;
  //       });
  //     });

  //     const arr: { key: string; value: number }[] = Object.keys(
  //       wordsThatElim
  //     ).map((key) => {
  //       return { key: key, value: wordsThatElim[key] };
  //     });
  //     console.log(arr.sort((a, b) => a.value - b.value));
  //     setRankedWords(arr);
  //   }
  // }, []);

  useEffect(() => {
    setWordDivs(() => {
      return guesses.map((guess, index) => {
        return (
          <div
            className={`guess-analysis ${
              index < guesses.length - 1 ? "next" : ""
            }`}
            key={Date.now() + index}
          >
            <div
              className="guess-analysis-content"
              onClick={() => handleClick(index)}
            >
              <i className="material-icons invis-spacer">chevron_left</i>
              {guess}
              <i className="material-icons">chevron_right</i>
            </div>
          </div>
        );
      });
    });
  }, [guesses]);

  useEffect(() => {
    const currentIndex = expanded;
    const prevIndex = expanded - 1;
    const previousGuessList = getGuessesLeft(prevIndex);
    const currentGuessList = getGuessesLeft(currentIndex);
    setAnalyticsDiv(
      <div
        ref={wrapperRef}
        className={`analytics-expanded ${
          expanded < 0 ? "hidden-analytics" : ""
        }`}
      >
        <h4>{guesses[expanded]}</h4>
        {prevIndex >= 0 ? (
          <p>
            Your previous guess left you with{" "}
            <span className="highlight">{previousGuessList.length}</span>
            {previousGuessList.length === 1 ? " word " : " words "} to guess
            from
          </p>
        ) : (
          <p>
            With no previous guesses, you had{" "}
            <span className="highlight">{previousGuessList.length}</span> words
            to guess from
          </p>
        )}
        {guesses[currentIndex] !== word.join("") ? (
          <p>
            You brought that number down to{" "}
            <span className="highlight">{currentGuessList.length}</span>{" "}
            possible
            {currentGuessList.length === 1 ? " guess " : " guesses "}
          </p>
        ) : (
          <p>You correctly guessed {word.join("")}</p>
        )}
      </div>
    );
  }, [expanded]);

  const getGuessesLeft = (index: number): string[] => {
    if (index < 0) return wordList;

    return checkAgainstFoundInfo(
      wordList,
      getWordEvalListsFromGuesses(
        guesses.filter((guess, i) => i <= index),
        word
      )
    );
  };

  return (
    <div className="analytics">
      {wordDivs}
      {analyticsDiv}
    </div>
  );
}

function getWordEvalListsFromGuesses(
  guessList: string[],
  wordToGuess: string[]
): { positives: string[]; negatives: string[]; maybes: string[] } {
  const pos = ["", "", "", "", ""];
  const neg: string[] = [];
  const may = ["", "", "", "", ""];

  guessList.forEach((guess) => {
    guess.split("").forEach((letter, index) => {
      if (letter === wordToGuess[index]) pos[index] = letter;
      else if (wordToGuess.includes(letter)) may[index] = letter;
      else neg.push(letter);
    });
  });

  return { positives: pos, negatives: neg, maybes: may };
}

function checkAgainstFoundInfo(
  wordList: string[],
  {
    positives,
    negatives,
    maybes,
  }: { positives: string[]; negatives: string[]; maybes: string[] }
): string[] {
  if (positives.length !== 5) console.log("error");
  if (maybes.length !== 5) console.log("error");

  const posString = positives.length
    ? positives.reduce(
        (prev, curr) => (curr === "" ? prev + "." : prev + curr),
        ""
      )
    : "{5}";
  const negString = negatives.join("");
  const posMaybesString = maybes.length
    ? maybes.reduce(
        (prev, curr) => (curr === "" ? prev : prev + `(?=.*${curr})`),
        ""
      )
    : "";
  const negMaybesString = maybes.length
    ? maybes.reduce(
        (prev, curr) => (curr === "" ? prev + "." : prev + `[^${curr}]`),
        ""
      )
    : "";
  const posRegex = new RegExp(`^${posString.toLowerCase()}$`); // all letters that definitely are in the word
  const negRegex = new RegExp(`^[^${negString.toLowerCase()}]{5}$`); // all letters that definitely are not in the word
  const posMaybeRegex = new RegExp(`^${posMaybesString.toLowerCase()}.*$`); // all letters that should be in the word somewhere
  const negMaybeRegex = new RegExp(`^${negMaybesString.toLowerCase()}$`); // all letters that should NOT be in certain positions. Same letters as above

  return wordList.filter((word) => {
    return (
      posRegex.test(word) &&
      negRegex.test(word) &&
      posMaybeRegex.test(word) &&
      negMaybeRegex.test(word)
    );
  });
}

function useOutsideAlerter(
  ref: RefObject<HTMLElement>,
  clickOutFunction: (event: MouseEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        event.target instanceof HTMLElement &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        clickOutFunction(event);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
