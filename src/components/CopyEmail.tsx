"use client";

import { useState } from "react";

interface CopyEmailProps {
  email: string;
  className?: string;
}

/** Copies the address, since mailto links do nothing without a mail app. */
export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Older browsers / insecure contexts: fall back to a hidden textarea
      const area = document.createElement("textarea");
      area.value = email;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={copy} className={className} aria-live="polite">
      {copied ? "Copied ✓" : "Copy email"}
    </button>
  );
}
