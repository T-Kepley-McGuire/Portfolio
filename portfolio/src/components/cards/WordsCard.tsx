import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "../../css/words-card.css";
import JSConfetti from "js-confetti";

export default function WordsCard(): JSX.Element {
  const jsConfetti = useRef<JSConfetti>();


  const [hovering, setHovering] = useState(false);
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [confettiTime, setConfettiTime] = useState(0);

  const [words, setWords] = useState<boolean[][]>([[false]]);

  const resetWords = () => {
    const numWords = 5;
    const numLetters = 5;
    const offset = 0.8;
    const letterFlipTime = 0.2;

    const chanceCorrect = 0.3;
    const init: boolean[][] = [];
    let settedConfetti = false;
    for (let i = 0; i < 5; i++) {
      const sub = [];
      for (let j = 0; j < 5; j++) {
        if (i < 1) sub.push(Math.random() < chanceCorrect);
        else sub.push(init[i - 1][j] || Math.random() < chanceCorrect);
      }
      if (!settedConfetti && sub.every((val) => val === true)) {
        setConfettiTime(
          (i + 1) * numLetters * letterFlipTime + Math.random() / 1000 - 0.3
        );
        setFinalTime((i + 1) * numLetters * letterFlipTime + offset);
        settedConfetti = true;
      }
      init.push(sub);
    }
    setWords(init);

    if (!settedConfetti) {
      setConfettiTime(0);
      setFinalTime(numWords * numLetters * letterFlipTime + offset);
    }
  };

  useEffect(() => {
    resetWords();

    const canvas = document.getElementById("confetti-canvas");
    if (canvas instanceof HTMLCanvasElement)
      jsConfetti.current = new JSConfetti({ canvas });

  }, []);

  useEffect(() => {
    if (confettiTime !== 0 && confettiTime < timer && jsConfetti.current) {
      jsConfetti.current.addConfetti({
        confettiRadius: 3,
        confettiColors: ["#180D6E", "#4298ED", "#40FFB3", "#3BCEAC", "#0EAD69"],
      });
      setConfettiTime(0);
    }
  }, [timer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hovering) {
        setTimer((current) => {
          if (current >= finalTime) {
            resetWords();
            return -0.2;
          }
          return current + 0.1;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [hovering, finalTime]);

  const letterCards: JSX.Element[] = words.map((word, index): JSX.Element => {
    const allTrueAndPrevTrue =
      index - 1 >= 0 &&
      word.every((letter) => letter === true) &&
      words[index - 1].every((letter) => letter === true);
    return (
      <div key={`row ${index}`} className="card-word-row">
        {word.map((letter, i): JSX.Element => {
          return (
            <div
              key={`letter ${i}`}
              className={`card-word-letter ${
                !allTrueAndPrevTrue &&
                timer > index * word.length * 0.2 + i * 0.1
                  ? `flipped ${letter ? "mini-correct" : ""}`
                  : ""
              }`}
            />
          );
        })}
      </div>
    );
  });

  return (
    <div key="words" className="page-card">
      <Link
        onMouseOver={() => {
          setHovering(true);
        }}
        onMouseLeave={() => setHovering(false)}
        className="page-card-content"
        to={"/wordguesser"}
      >
        <canvas id="confetti-canvas" className="card-word-canvas" />
        <h3>word guesser</h3>
        <div className="card-word">{letterCards}</div>
      </Link>
    </div>
  );
}
