"use client";

import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({
  label,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="font-semibold text-slate-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full h-12 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${className}`}
      />

    </div>
  );
}