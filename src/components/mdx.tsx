import React, { ReactNode } from "react";
import { remark } from "remark";
import remarkHtml from "remark-html";

import { SmartImage, SmartLink, Text } from "@/once-ui/components";
import { TextProps } from "@/once-ui/interfaces";
import { SmartImageProps } from "@/once-ui/components/SmartImage";

// ---------- Simple markdown renderer (replaces next-mdx-remote/rsc) ----------

async function markdownToHtml(source: string): Promise<string> {
  const result = await remark().use(remarkHtml, { sanitize: false }).process(source);
  return result.toString();
}

type CustomMDXProps = {
  source: string;
  components?: Record<string, React.ComponentType<any>>;
};

export async function CustomMDX({ source }: CustomMDXProps) {
  const html = await markdownToHtml(source);
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
