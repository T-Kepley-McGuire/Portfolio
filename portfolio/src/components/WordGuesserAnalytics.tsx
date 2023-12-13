import React from "react";
// import { CSSTranitionGroup } from "react-transition-group";

import text from "../utilities/words";

import "../css/word-guesser-analytics.css";

export default function WordGuesserAnalytics({
  guesses,
}: {
  guesses: string[];
}) {
  return (
    <div
      // className="analytics"
      // transitionName="example"
      // transitionEnterTimeout={500}
      // transitionLeaveTimeout={300}
    >
      {guesses
        .map((guess, index) => {
          return (
            <div className="guess-analysis" key={guess + " " + index}>
              {guess}
            </div>
          );
        })
        .reverse()}
    </div>
  );
}
