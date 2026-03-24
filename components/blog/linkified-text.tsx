import React from "react";

const urlPattern = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/gi;
const startsWithUrl = /^https?:\/\//i;

export function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(urlPattern);

  return (
    <>
      {parts.map((part, index) => {
        if (startsWithUrl.test(part)) {
          return (
            <a
              key={`${part}-${index}`}
              href={part}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:text-ink"
            >
              {part}
            </a>
          );
        }

        return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
      })}
    </>
  );
}
