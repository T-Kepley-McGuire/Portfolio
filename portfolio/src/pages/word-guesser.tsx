import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import text from "../utilities/words";

import "../css/word-guesser.css";
import JSConfetti from "js-confetti";

function useQuery() {
  const location = useLocation();

  return React.useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
}

export default function WordGuesser(): JSX.Element {
  let query = useQuery();

  
  const jsConfetti = new JSConfetti();

  const init = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  const wordList = text.split("\n");
  const [theWord, setTheWord] = useState(Array<string>);
  const [seed, setSeed] = useState(Number);
  const [words, setWords] = useState(init);
  const [currentWorkingLine, setCurrentWorkingLine] = useState(0);
  const [currentWorkingLetter, setCurrentWorkingLetter] = useState(0);
  const [submitted, setSubmitted] = useState(init.map((i) => false));
  const [correct, setCorrect] = useState(init.map((i) => i.map((l) => -1)));
  const [wordError, setWordError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tempSeed =
      Number(query.get("seed")) || Math.floor(Math.random() * 1379);
    setSeed(tempSeed);
  }, []);

  useEffect(() => {
    setCurrentWorkingLetter(0);
  }, [currentWorkingLine]);

  useEffect(() => {
    const newLetter = document.getElementById(
      `${currentWorkingLine} ${currentWorkingLetter}`
    );
    newLetter?.focus();
    if (newLetter instanceof HTMLInputElement) {
      newLetter.select();
    }
  }, [currentWorkingLetter]);

  useEffect(() => {
    setTheWord(wordList[seed].toUpperCase().split(""));
  }, [seed]);

  useEffect(() => {
    if (successful) {
      jsConfetti.addConfetti({confettiColors: [
        '#180D6E', '#4298ED', '#40FFB3', '#3BCEAC', '#0EAD69'
      ]}
    );
    }
  }, [successful]);

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const [wordIndex, letterIndex] = target.id.split(" ");

    setWords((wordList) => {
      const newWords = [...wordList];
      newWords[Number(wordIndex)][Number(letterIndex)] =
        target.value.toUpperCase();
      return newWords;
    });

    if (target.value !== "") handleMove(1);
  };

  const handleBackspace = () => {
    setWords((wordList) => {
      const newWords = [...wordList];
      newWords[currentWorkingLine][currentWorkingLetter] = "";
      return newWords;
    });
    handleMove(-1);
  };

  const handleMove = (delta: number) => {
    if (delta < 0 && currentWorkingLetter > 0) {
      setCurrentWorkingLetter(currentWorkingLetter - 1);
    }
    if (delta > 0 && currentWorkingLetter < words[0].length - 1) {
      setCurrentWorkingLetter(currentWorkingLetter + 1);
    }
  };

  const handleFocus = ({ target }: { target: HTMLInputElement }) => {
    setCurrentWorkingLetter(Number(target.id.split(" ")[1]));
    target.select();
  };

  const handleSubmit = (event: React.FormEvent, wordIndex: number) => {
    event.preventDefault();

    if (
      words[currentWorkingLine].join("").length < 5 ||
      !wordList.includes(words[currentWorkingLine].join("").toLowerCase())
    ) {
      submissionError();
    } else {
      setSubmitted((currentlySubmitted) => {
        const newSubmitted = [...currentlySubmitted];
        newSubmitted[currentWorkingLine] = true;
        return newSubmitted;
      });

      words[currentWorkingLine].forEach((letter, letterIndex) => {
        if (letter === theWord[letterIndex]) {
          setCorrect((currntlyCorrect) => {
            const newCorrect = [...currntlyCorrect];
            newCorrect[currentWorkingLine][letterIndex] = 1;
            return newCorrect;
          });
        } else if (theWord.includes(letter)) {
          setCorrect((currntlyCorrect) => {
            const newCorrect = [...currntlyCorrect];
            newCorrect[currentWorkingLine][letterIndex] = 0;
            return newCorrect;
          });
        }
      });
      setCurrentWorkingLine(currentWorkingLine + 1);

      if (words[currentWorkingLine].join("") === theWord.join("")) {
        setSuccessful(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentWorkingLine(0);
    setSubmitted(init.map((i) => false));
    setCorrect(init.map((i) => i.map((l) => -1)));
    setWords(init);
    setSuccessful(false);
    setSeed(Math.floor(Math.random() * wordList.length));
  };

  function submissionError() {
    setWordError(true);
    setTimeout(() => {
      setWordError(false);
    }, 200);

    setCurrentWorkingLetter(0);
  }

  function copy() {
    const val = window.location.href;

    const newVal = val.replace(/wordguesser(.*)/, `wordguesser?seed=${seed}`);

    navigator.clipboard.writeText(newVal);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  return (
    <main>
      <h3>
        {successful
          ? "Congratulations!"
          : currentWorkingLine >= words.length
          ? `The word was ${theWord.join("")}`
          : "Guess the word"}
      </h3>
      {init.map((word, wordIndex) => {
        return (
          <form
            onSubmit={(event) => handleSubmit(event, wordIndex)}
            className={`word-row ${
              wordIndex === currentWorkingLine && !successful
                ? wordError
                  ? "error"
                  : "current-row"
                : ""
            }`}
            id={"word " + wordIndex}
            key={"word " + wordIndex}
          >
            {word.map((letter, letterIndex) => {
              return (
                <input
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleSubmit(e, wordIndex);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") handleMove(1);
                    if (e.key === "ArrowLeft") handleMove(-1);
                    if (e.key === "Backspace") handleBackspace();
                  }}
                  disabled={currentWorkingLine !== wordIndex || successful}
                  onFocus={handleFocus}
                  className={`letter ${
                    correct[wordIndex][letterIndex] === 1
                      ? "correct"
                      : correct[wordIndex][letterIndex] === 0
                      ? "partially-correct"
                      : ""
                  } ${submitted[wordIndex] ? "submitted" : ""}`}
                  key={letterIndex}
                  id={wordIndex + " " + letterIndex}
                  onChange={handleChange}
                  value={words[wordIndex][letterIndex]}
                  maxLength={1}
                  style={{
                    transition: `transform 0.7s ease ${
                      0.1 * letterIndex
                    }s, background-color 0.35s ease ${0.1 * letterIndex}s`,
                  }}
                ></input>
              );
            })}
          </form>
        );
      })}
      <button className="form-button" onClick={handleReset}>
        Reset
      </button>
      <button className="form-button" onClick={copy}>
        <i className="material-icons">share</i> Share
      </button>
      <p className={copied ? "copy-message" : "copy-message-hidden"}>
        Copied URL to clipboard
      </p>
    </main>
  );
}
