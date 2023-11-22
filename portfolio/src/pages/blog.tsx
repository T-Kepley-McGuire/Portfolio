import { resourceUsage } from "process";
import React, { JSXElementConstructor, useEffect, useRef, useState } from "react";

import "../css/blog.css";
import parseMarkdown, { MarkdownFrontmatter } from "../utilities/md-parser";
import { listArticles } from "../utilities/server-api";
import Markdown from "react-markdown";
import AnimationCanvas from "../components/AnimationCanvas";

function Blog() {

  const [markdownList, setMarkdownList] = useState(Array<MarkdownFrontmatter>);
  
  useEffect(() => {
    const abortController = new AbortController();
    listArticles(abortController.signal).then((result: Array<string>) => {
      const metaData: Array<MarkdownFrontmatter> = [];

      result.forEach((mdFile) => {
        metaData.push(parseMarkdown(mdFile));
      });

      metaData.sort((a: MarkdownFrontmatter, b: MarkdownFrontmatter) => {
        return Number(b.timestamp) - Number(a.timestamp);
      });

      setMarkdownList(metaData);

    }).catch((error) => {
      console.log("no articles")
    })
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.preventDefault();

    const div: HTMLElement | null = document.querySelector(`#${id}`);
    if (div !== null) {
      div.classList.toggle("expanded");
    }
  };

  return (
    <main>
      <h2>My Blog</h2>
      <h4>Enjoy</h4>
      {markdownList.map((md: MarkdownFrontmatter, index: number) => {
        return (
          <div className="blog-article " id={md.id}>
              <div onClick={(e) => handleClick(e, md.id || (""+index))} className="overlay"></div>
            <div className="header">
              <i className="material-icons">chevron_right</i>
            </div>
            <Markdown>{md.content}</Markdown>
          </div>
        )
      })}
    </main>
  );
}

export default Blog;
