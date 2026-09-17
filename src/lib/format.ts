import React from "react";

// Parser **gras**, ==highlight==, [[cite:N]] — extrait de MessageItem.tsx:46-92
export function parseFormattedText(raw: string, onCite: (n: string) => void) {
  const parts = raw.split(/(\*\*[^*]+\*\*|==[^=]+==|\[\[cite:\d+\]\]|\n)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return React.createElement("strong", { key: i, className: "font-bold" }, part.slice(2, -2));
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return React.createElement(
        "mark",
        { key: i, className: "px-1 py-0.5 rounded-md", style: { background: "var(--mark-bg)" } as React.CSSProperties },
        part.slice(2, -2)
      );
    }
    if (part.startsWith("[[cite:")) {
      const n = part.replace("[[cite:", "").replace("]]", "");
      return React.createElement(
        "button",
        {
          key: i,
          onClick: () => onCite(n),
          className: "inline-flex w-[15px] h-[15px] rounded-full text-[9.5px] font-bold ml-1",
          style: { background: "var(--accent-soft)", color: "var(--accent)" } as React.CSSProperties,
        },
        n
      );
    }
    if (part === "\n") return React.createElement("br", { key: i });
    return React.createElement("span", { key: i }, part);
  });
}
