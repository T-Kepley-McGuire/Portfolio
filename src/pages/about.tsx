import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

import "../css/about.css";

import { listAbout } from "../utilities/server-api";

export default function About(): JSX.Element {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    listAbout(abortController.signal).then((res) => setMarkdown(res));
  }, []);

  return (
    <main>
      <Markdown className="article">{markdown}</Markdown>
    </main>
  );
}
