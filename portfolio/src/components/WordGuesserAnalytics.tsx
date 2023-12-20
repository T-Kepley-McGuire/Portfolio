import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

import text from "../utilities/word-processing/words";
import top100 from "../utilities/word-processing/top-100-guesses";

import "../css/word-guesser-analytics.css";
import {
  rankByEntropy,
  repeatedlyCullList,
} from "../utilities/word-processing/word-processing";

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

  const [showSpoilers, setShowSpoilers] = useState<boolean[]>([false, false]);

  const wordList = text.split("\n");
  const topGuesses = top100.split("\n");

  const handleClick = (index: number) => {
    setExpanded(index);
  };

  useEffect(() => {
    setShowSpoilers([false, false]);
  }, [expanded]);

  useEffect(() => {
    if(guesses.length === 0) setExpanded(-1);
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

    const rankedPreviousGuesses =
      prevIndex >= 0
        ? rankByEntropy(getGuessesLeft(prevIndex))
        : rankByEntropy(topGuesses);

    const rankedNextGuesses =
      currentIndex >= 0 ? rankByEntropy(getGuessesLeft(currentIndex)) : [];
    setAnalyticsDiv(
      <div
        ref={wrapperRef}
        className={`analytics-expanded ${
          expanded < 0 ? "hidden-analytics" : ""
        }`}
      >
        <h4>{guesses[expanded]}</h4>
        <div className="close-button-container" onClick={() => setExpanded(-1)}>
          <div className="close-button" />
        </div>
        {prevIndex >= 0 ? (
          <p>
            Your previous guess left you with{" "}
            <span className="highlight-word">{previousGuessList.length}</span>
            {previousGuessList.length === 1 ? " word " : " words "} to guess
            from
          </p>
        ) : (
          <p>
            With no previous guesses, you had{" "}
            <span className="highlight-word">{previousGuessList.length}</span>{" "}
            words to guess from
          </p>
        )}
        {guesses[currentIndex] !== word.join("") ? (
          <p>
            You brought that number down to{" "}
            <span className="highlight-word">{currentGuessList.length}</span>{" "}
            possible
            {currentGuessList.length === 1 ? " guess " : " guesses "}
          </p>
        ) : (
          <p>You correctly guessed {word.join("")}</p>
        )}
        <p className="spoiler-container">
          You could have guessed{" "}
          {showSpoilers[0] ? (
            <Spoiler
              rankedWords={rankedPreviousGuesses.filter(
                (guess, i) =>
                  i < 5 && guess[0].toUpperCase() !== guesses[currentIndex]
              )}
            />
          ) : (
            <HideSpoiler
              executeOnClick={() => setShowSpoilers([true, showSpoilers[1]])}
            />
          )}
        </p>
        {guesses[currentIndex] !== word.join("") ? (
          <p className="spoiler-container">
            Here are some optimal next guesses:{" "}
            {showSpoilers[1] ? (
              <Spoiler
                rankedWords={rankedNextGuesses.filter((_, i) => i < 15)}
              />
            ) : (
              <HideSpoiler
                executeOnClick={() => setShowSpoilers([showSpoilers[0], true])}
              />
            )}
          </p>
        ) : null}
      </div>
    );
  }, [expanded, showSpoilers]);

  const getGuessesLeft = (index: number): string[] => {
    if (index < 0) return wordList;

    return repeatedlyCullList(
      wordList,
      guesses.slice(0, index + 1),
      word.join("")
    );
  };

  return (
    <div className="analytics">
      {wordDivs}
      {analyticsDiv}
    </div>
  );
}

function HideSpoiler({ executeOnClick }: { executeOnClick: () => void }) {
  return (
    <span
      className="spoiler-button highlight-word"
      onClick={() => executeOnClick()}
    >
      Show spoiler
    </span>
  );
}

function Spoiler({
  rankedWords,
}: {
  rankedWords: [string, number][];
}): ReactElement {
  return rankedWords.length > 0 ? (
    <span className="fade-in">
      {rankedWords
        .map((wordEntropy) => wordEntropy[0])
        .join(", ")
        .toUpperCase()}
    </span>
  ) : (
    <span>That was it. That was the best guess!</span>
  );
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
