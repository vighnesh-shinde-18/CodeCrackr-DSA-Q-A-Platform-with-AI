// src/components/aiResponse/CopyButton.jsx
import { useState } from "react";
import { toast } from "sonner";
import { Copy,Check } from 'lucide-react';
export default function CopyButton({ content, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1  rounded-md text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white transition"
    >
      {copied ? (
        <span className="flex items-center gap-1">
          <Check size={14} /> Copied
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <Copy size={14} /> Copy
        </span>
      )}
    </button>
  );
}
