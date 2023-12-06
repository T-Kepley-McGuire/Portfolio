import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../../css/words-card.css";

export default function WordsCard(): JSX.Element {
  const [hovering, setHovering] = useState(false);
  const [timer, setTimer] = useState(0);

//   const init: boolean[][] = [];
//   for (let i = 0; i < 5; i++) {
//     const sub = [];
//     for (let j = 0; j < 5; j++) {
//       if (i < 1) sub.push(Math.random() < 0.3);
//       else sub.push(init[i - 1][j] || Math.random() < 0.3);
//     }
//     init.push(sub);
//   }
  const [words, setWords] = useState<boolean[][]>([[false]]);

  const resetWords = () => {
    const init: boolean[][] = [];
    for (let i = 0; i < 5; i++) {
      const sub = [];
      for (let j = 0; j < 5; j++) {
        if (i < 1) sub.push(Math.random() < 0.3);
        else sub.push(init[i - 1][j] || Math.random() < 0.3);
      }
      init.push(sub);
    }
    setWords(init);
  };

  useEffect(resetWords, [])

  const handleAnimationEnd = (animation: React.AnimationEvent) => {
    if (animation.animationName === "back") {
      console.log("here");
    }
  };

  const letterCards: JSX.Element[] = words.map((word, index): JSX.Element => {
    return (
      <div key={`row ${index}`} className="card-word-row">
        {word.map((letter, i): JSX.Element => {
          return (
            <div
              key={`letter ${i}`}
              className={`card-word-letter ${
                timer > index * word.length * 0.2 + i * 0.1
                  ? `flipped ${letter ? "mini-correct" : ""}`
                  : ""
              }`}
              //   style={{
              //     animation: `${letter ? "flip-blue" : "flip-gray"} 0.5s ${
              //       0.1 + index * word.length * 0.2 + i * 0.1
              //     }s forwards, back 0.5s ${
              //       words.length * word.length * 0.2
              //     }s forwards`,

              //     // animationDelay: `${index * word.length * 0.3 + i * 0.1}s`,
              //     animationPlayState: hovering ? "running" : "paused",
              //   }}
              onAnimationEnd={handleAnimationEnd}
            />
          );
        })}
      </div>
    );
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (hovering) {
        setTimer((current) => {
          if (current >= words.length * words[0].length * 0.2) {
            resetWords();
            return -0.2;
          }
          return current + 0.1;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [hovering]);

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
        <h3>word guesser</h3>
        <div className="card-word">{letterCards}</div>
      </Link>
    </div>
  );
}
