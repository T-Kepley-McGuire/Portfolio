import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import text from "../utilities/words";

import "../css/word-guesser.css";

function useQuery() {
  const loc = useLocation();

  return React.useMemo(() => new URLSearchParams(loc.search), [loc.search]);
}

export default function WordGuesser(): JSX.Element {
  let query = useQuery();

  const init = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];

  const [theWord, setTheWord] = useState(["L", "E", "A", "R", "N"]);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1379));
  const wordList = text.split("\n");

  useEffect(() => {
    setTheWord(wordList[seed].toUpperCase().split(""));
  }, [seed]);

  useEffect(() => {
    const tempSeed =
      Number(query.get("seed")) || Math.floor(Math.random() * 1379);
    setSeed(tempSeed);
  }, []);

  const [words, setWords] = useState(init);
  const [currentWorkingLine, setCurrentWorkingLine] = useState(0);
  const [submitted, setSubmitted] = useState(init.map((i) => false));
  const [correct, setCorrect] = useState(init.map((i) => i.map((l) => -1)));

  const [wordError, setWordError] = useState(false);
  const [successful, setSuccessful] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    const [wordIndex, letterIndex] = target.id.split(" ");
    setWords((wordList) => {
      const newWords = [...wordList];
      if (wordIndex && letterIndex) {
        newWords[Number(wordIndex)][Number(letterIndex)] =
          target.value.toUpperCase();
      }
      return newWords;
    });

    if (target.value === "" && Number(letterIndex) > 0) {
      const next = document.getElementById(
        `${wordIndex} ${Number(letterIndex) - 1}`
      );
      next?.focus();
    } else if (target.value !== "" && Number(letterIndex) < 4) {
      const next = document.getElementById(
        `${wordIndex} ${Number(letterIndex) + 1}`
      );
      next?.focus();
    }
  };

  const handleFocus = ({ target }: { target: HTMLInputElement }) => {
    target.select();
  };

  const handleSubmit = (event: React.FormEvent, wordIndex: number) => {
    event.preventDefault();

    if (
      words[wordIndex].join("").length < 5 ||
      !wordList.includes(words[wordIndex].join("").toLowerCase())
    ) {
      setWordError(true);
      setTimeout(() => {
        setWordError(false);
      }, 200);

      const beginningLine = document.getElementById(`${currentWorkingLine} 0`);
      beginningLine?.focus();
    } else {
      setSubmitted((currentlySubmitted) => {
        const newSubmitted = [...currentlySubmitted];
        newSubmitted[wordIndex] = true;
        return newSubmitted;
      });
      setCurrentWorkingLine(currentWorkingLine + 1);

      words[wordIndex].forEach((letter, letterIndex) => {
        if (letter === theWord[letterIndex]) {
          setCorrect((currntlyCorrect) => {
            const newCorrect = [...currntlyCorrect];
            newCorrect[wordIndex][letterIndex] = 1;
            return newCorrect;
          });
        } else if (theWord.includes(letter)) {
          setCorrect((currntlyCorrect) => {
            const newCorrect = [...currntlyCorrect];
            newCorrect[wordIndex][letterIndex] = 0;
            return newCorrect;
          });
        }
      });

      if (words[wordIndex].join("") === theWord.join("")) {
        setSuccessful(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentWorkingLine(0);
    setSubmitted(init.map((i) => false));
    setCorrect(init.map((i) => i.map((l) => -1)));
    setWords(init);

    setSeed(Math.floor(Math.random() * 1379));
  };

  useEffect(() => {
    const newLine = document.getElementById(`${currentWorkingLine} 0`);
    newLine?.focus();
  }, [currentWorkingLine]);

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
              wordIndex === currentWorkingLine
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
                    if (e.key === "enter") handleSubmit(e, wordIndex);
                  }}
                  disabled={currentWorkingLine !== wordIndex}
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
            <button className="word-submit" type="submit">
              GO
            </button>
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
