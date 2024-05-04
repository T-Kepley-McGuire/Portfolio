import React, { FormEvent, useEffect, useRef, useState } from "react";

function TypingPractice() {
  const text = `his made turn men mile life need small high little name read answer which girl name upon when he me came page large one too for add use thought own his them world those something name time point once year best back or plant talk into another through try is song large show almost world grow put get girl change first out mile people ask those example good large these try never girl of what see answer she how us life us number turn place way been must now sound.`;
  const totalWords = (text.match(/\w+/gm) || []).length + 1;

  const [pastText, setPastText] = useState("");
  const [pastWrong, setPastWrong] = useState("");
  const [futureText, setFutureText] = useState(text);

  const [typedText, setTypedText] = useState("");
  const prevTypedText = useRef("");

  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(Date.now());

  interface ErrorsType {
    [key: string]: number
  }

  const errors = useRef<ErrorsType>({});

  const updateTypedText = (event: FormEvent<HTMLTextAreaElement>) => {
    setTypedText(event.currentTarget.value);
  };

  useEffect(() => {
    const charsTyped = typedText.length;
    const splitString = (str: string, index: number): [string, string] => [
      str.substring(0, index),
      str.substring(index),
    ];
    const [past, future] = splitString(text, charsTyped);
    let [rightPast, wrongPast] = [past, ""];
    if (past !== typedText) {
      // FIND FIRST DIFFERENCE
      for (let i: number = 0; i < charsTyped; i++) {
        if (typedText[i] !== past[i]) {
          [rightPast, wrongPast] = splitString(past, i);

          break;
        }
      }
    }

    setPastText(rightPast);
    setPastWrong(wrongPast);
    setFutureText(future);

    const lli = typedText.length - 1;
    if (
      typedText.length > prevTypedText.current.length &&
      typedText[lli] != text[lli]
    ) {
      errors.current[typedText[lli]] = (errors.current[typedText[lli]] || 0) + 1;
      console.log(errors.current);
    }
  }, [typedText]);

  useEffect(() => {}, [typedText]);

  useEffect(() => {
    let interval = setInterval(() => null, 1000);
    if (typedText === "") {
      //textbox has been emptied
      setCurrentTime(Date.now());
      setStartTime(Date.now());
      errors.current = {};
    } else if (typedText != text) {
      //just started typing
      if (prevTypedText.current === "") setStartTime(Date.now());
      interval = setInterval(() => setCurrentTime(Date.now()), 10);
    } else {
      //finished typing
    }

    prevTypedText.current = typedText;
    return () => {
      clearInterval(interval);
    };
  }, [typedText]);

  const formatMsAsString = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms / 1000) % 60;
    const milis = ms % 1000;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}.${milis}`;
  };

  return (
    <main>
      <h2>This is my typing practice</h2>
      <div className="typing-wrapper">
        <p className="typing-article">
          <span className="highlight dark">{pastText}</span>
          <span className="highlight red">{pastWrong}</span>
          <span>{futureText}</span>
        </p>
        <textarea
          className="typing-input"
          name="typingInput"
          onInput={updateTypedText}
        />
        <div className="typing-info-wrapper">
          <div className="typing-info words-remaining">
            Words remaining:{" "}
            <div className="typing-info-stat">
              {totalWords - (typedText.match(/\w+/gm) || []).length}
            </div>
          </div>
          <div className="typing-info timer">
            Time:
            <div className="typing-info-stat">
              {formatMsAsString(currentTime - startTime)}
            </div>
          </div>
          <div className="typing-info wpm">
            Words per minute:
            <div className="typing-info-stat">
              {currentTime - startTime > 0
                ? Math.floor(
                    (typedText.match(/\w+/gm) || []).length /
                      ((currentTime - startTime) / 60000)
                  )
                : "0"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TypingPractice;
