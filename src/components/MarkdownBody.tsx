type MarkdownBodyProps = {
  body: string;
};

export function MarkdownBody({ body }: MarkdownBodyProps) {
  const lines = body.split("\n");

  return (
    <div className="markdown-body">
      {lines.map((line, index) => {
        if (line.startsWith("- ")) {
          return <li key={index}>{line.slice(2)}</li>;
        }

        if (line.trim() === "") {
          return null;
        }

        return <p key={index}>{line}</p>;
      })}
    </div>
  );
}
