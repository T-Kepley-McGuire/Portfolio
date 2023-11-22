/**
 * Represents a parsed Markdown document with YAML frontmatter, where metadata properties are optional.
 *
 * @property {string} content - The main content of the Markdown document excluding YAML frontmatter.
 * @property {T} [key: string]: string | undefined - Optional metadata properties parsed from the YAML frontmatter.
 *
 * This generic type allows for parsing Markdown documents with YAML frontmatter.
 * The `data` property contains the main content of the Markdown document.
 * Metadata properties can vary and are optional, based on the provided generic type `T`.
 * If metadata properties are present in the frontmatter, they are included as optional properties of the type.
 */
type MarkdownWithYamlFrontmatter<T> = {
  content: string;
} & {
  [K in keyof T]?: string;
};

/**
 * Parses a Markdown document with YAML frontmatter, extracting both metadata properties and the main content.
 *
 * @param {string} markdown - The Markdown content including YAML frontmatter.
 * @returns {MarkdownWithYamlFrontmatter<T>} - An object containing parsed metadata properties (if available) and the main content of the Markdown document.
 *
 * This function extracts metadata properties and the main content from a Markdown document with YAML frontmatter.
 * The function uses regular expressions to identify and parse the YAML frontmatter section, extracting metadata key-value pairs.
 * If metadata properties are found, they are included in the returned object.
 * If no valid YAML frontmatter is present, the function includes the entire input Markdown content in the 'data' property.
 */
export default function parseMarkdownWithYamlFrontmatter2<
  T extends Record<string, string>
>(markdown: string): MarkdownWithYamlFrontmatter<T> {
  const metaRegExp = new RegExp(/^---[\n\r](((?!---).|[\n\r])*)[\n\r]---$/m);

  // "rawYamlHeader" is the full matching string, including the --- and ---
  // "yamlVariables" is the first capturing group, which is the string content between the --- and ---
  const [rawYamlHeader, yamlVariables] = metaRegExp.exec(markdown) ?? [];

  if (!rawYamlHeader || !yamlVariables) {
    return { content: markdown };
  }

  const keyValues = yamlVariables.split("\n");

  const frontmatter = Object.fromEntries<string>(
    keyValues.map((keyValue) => {
      const splitted = keyValue.split(":");
      const [key, value] = splitted;

      return [key ?? keyValue, value?.trim() ?? ""];
    })
  ) as Record<keyof T, string>;

  return {
    ...frontmatter,
    content: markdown.replace(rawYamlHeader, "").trim(),
  };
}
