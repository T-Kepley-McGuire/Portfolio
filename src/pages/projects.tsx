import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import "../css/projects.css";
import { listProjects } from "../utilities/server-api";
import { parseMarkdownWithYamlFrontmatter } from "../utilities/md-metadata-parser";
import getMostVisible from "../utilities/get-most-visible";

const BACKEND_URL: string = process.env.BACKEND_URL || "http://localhost:5001";

export default function Projects(): JSX.Element {
  type MarkdownFrontmatter = {
    title?: string;
    timestamp?: string;
    data: string;
  };
  const [markdownList, setMarkdownList] = useState(Array<MarkdownFrontmatter>);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    listProjects(abortController.signal).then((result: Array<string>) => {
      const metaData: Array<MarkdownFrontmatter> = [];

      result.forEach((mdFile) => {
        const parsed =
          parseMarkdownWithYamlFrontmatter<MarkdownFrontmatter>(mdFile);
        metaData.push(parsed);
      });

      metaData.forEach((md: MarkdownFrontmatter) => {
        const backendUrl = `${BACKEND_URL}/images`;
        const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
        md.data = md.data.replace(
          imageRegex,
          (match: string, altText: string, imageUrl: string): string => {
            const absoluteUrl = `${backendUrl}${imageUrl}`;

            return `<div class="captioned-image">
                    <p>${altText}</p>
                    <img src=${absoluteUrl} alt=${altText} />
                  </div>`;
            //return `![${altText}](${absoluteUrl})`;
          }
        );

        const codeRegex = /```(.*?)\n((.|\n)*?)```/gs;
        md.data = md.data.replace(
          codeRegex,
          (match: string, language: string, code: string): string => {
            return `${language ? `<div class="code-header">
                      <p>Language: ${language}</p>
                    </div>` : ""}
                    <div class="code-block">
                      <pre><code>${code}</code></pre>
                    </div>`;
          }
        );
        //console.log(md.data);
      });

      metaData.sort((a: MarkdownFrontmatter, b: MarkdownFrontmatter) => {
        return Number(b.timestamp) - Number(a.timestamp);
      });

      setMarkdownList(metaData);
      setActiveSection(metaData[0].title || "");
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
          <Markdown rehypePlugins={[[rehypeRaw]]}>{md.data}</Markdown>
        </div>
      ))}
    </main>
  );
}
