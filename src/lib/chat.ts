export const formatForMarkdown = (text: string) => {
  return (
    text
      // add spacing after headers (### Header → ### Header\n\n)
      .replace(/(#+\s.*)/g, "$1\n\n")
      // ensure code block declarations are on their own line
      .replace(/```(\w+)?/g, "\n```$1\n")
      // normalize double newlines (for paragraph breaks)
      .replace(/\n{2,}/g, "\n\n")
  );
};
