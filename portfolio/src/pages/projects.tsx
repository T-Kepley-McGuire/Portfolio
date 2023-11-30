import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import "../css/projects.css";
import { listProjects } from "../utilities/server-api";
import getMostVisible from "../utilities/get-most-visible";
import parseMarkdown, { MarkdownFrontmatter } from "../utilities/md-parser";

// const BACKEND_URL: string =
//   process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";
//console.log("here", BACKEND_URL);

export default function Projects(): JSX.Element {
  const [markdownList, setMarkdownList] = useState(Array<MarkdownFrontmatter>);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    listProjects(abortController.signal)
      .then((result: Array<string>) => {
        const metaData: Array<MarkdownFrontmatter> = [];

        result.forEach((mdFile) => {
          metaData.push(parseMarkdown(mdFile));
        });

        metaData.sort((a: MarkdownFrontmatter, b: MarkdownFrontmatter) => {
          return Number(b.timestamp) - Number(a.timestamp);
        });

        setMarkdownList(metaData);
        setActiveSection(metaData[0].title || "");
      })
      .catch((error) => {
        console.log("no projects");
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const articles = [...document.querySelectorAll(".article")];
      const mostVisible = getMostVisible(articles, 0.45);
      setActiveSection(mostVisible.id);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <main>
      <h2>Projects</h2>
      <div className="sidebar">
        <p className="sidebar-title">Projects: </p>
        {markdownList.map((md: MarkdownFrontmatter) => {
          console.log(md.content);
          return (
            <a
              key={md.title}
              className={`card ${activeSection === md.title ? "current" : ""}`}
              href={`#${md.title}`}
            >
              {md.title}
            </a>
          );
        })}
      </div>
      {markdownList.map((md: MarkdownFrontmatter) => (
          <div className="article" id={md.title} key={md.title}>
            <Markdown rehypePlugins={[[rehypeRaw]]}>{md.content}</Markdown>
          <hr />
          </div>
      ))}
    </main>
  );
}
