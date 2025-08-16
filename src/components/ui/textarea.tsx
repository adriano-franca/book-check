import React, { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
}

export const Textarea: React.FC<TextareaProps> = ({
  className = "",
  ...props
}) => {
  return (
    <textarea
      className={`w-full rounded-md border border-gray-300
        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        px-3 py-2 resize-y
        text-base
        placeholder:text-gray-400
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    />
  );
};
