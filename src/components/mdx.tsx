import React, { ReactNode } from "react";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import { SmartImage, SmartLink, Text } from "@/once-ui/components";
import { TextProps } from "@/once-ui/interfaces";
import { SmartImageProps } from "@/once-ui/components/SmartImage";

// ---------- Simple markdown renderer (replaces next-mdx-remote/rsc) ----------

async function markdownToHtml(source: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(source);
  return result.toString();
}

type CustomMDXProps = {
  source: string;
  components?: Record<string, React.ComponentType<any>>;
};

/** URL-safe id for a heading, shared by the renderer and the table of contents. */
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The "## " section headings of a Markdown source, for an on-page menu. */
export function getHeadings(source: string) {
  return source
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").replace(/[*_`]/g, "").trim();
      return { text, id: headingId(text) };
    });
}

export async function CustomMDX({ source }: CustomMDXProps) {
  const rendered = await markdownToHtml(source);
  // give h2/h3 ids so the on-page menu and #links can jump to them
  const html = rendered.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (_m, tag: string, inner: string) => `<${tag} id="${headingId(inner)}">${inner}</${tag}>`);
  return (
    <div
      className="mdx-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ---------- Legacy helpers kept for backwards compatibility ----------

type TableProps = {
  data: {
    headers: string[];
    rows: string[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  if (href.startsWith("/")) {
    return (
      <SmartLink href={href} {...props}>
        {children}
      </SmartLink>
    );
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
