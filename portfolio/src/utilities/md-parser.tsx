import parseMarkdownWithYamlFrontmatter from "./md-metadata-parser";

const BACKEND_URL: string =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5001";

export type MarkdownFrontmatter = {
  title?: string;
  timestamp?: string;
  id?: string;
  content: string;
};

export default function parseMarkdown(markdown: string) {
  const mdObject: MarkdownFrontmatter =
    parseMarkdownWithYamlFrontmatter(markdown);
  mdObject.content = parseImageUrls(mdObject.content);

  mdObject.content = parseCodeBlocks(mdObject.content);

  return mdObject;
}

function parseImageUrls(markdown: string): string {
  const backendUrl = `${BACKEND_URL}/images`;
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
  return markdown.replace(
    imageRegex,
    (match: string, altText: string, imageUrl: string): string => {
      const absoluteUrl = `${backendUrl}${imageUrl}`;

      return `<div class="captioned-image">
                    <p>${altText}</p>
                    <img src=${absoluteUrl} alt=${altText} />
                  </div>`;
    }
  );
}

function parseCodeBlocks(markdown: string): string {
  const codeRegex = /```(.*?)\n((.|\n)*?)```/gs;
  return markdown.replace(
    codeRegex,
    (match: string, language: string, code: string): string => {
      return `${
        language
          ? `<div class="code-header">
                      <p>Language: ${language}</p>
                    </div>`
          : ""
      }
                    <div class="code-block">
                      <pre><code>${code}</code></pre>
                    </div>`;
    }
  );
}
