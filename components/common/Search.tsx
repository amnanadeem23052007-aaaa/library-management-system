"use client";

import { Search as SearchIcon } from "lucide-react";

interface Props {
  placeholder?: string;
}

export default function Search({
  placeholder = "Search...",
}: Props) {
  return (
    <div className="relative w-full max-w-sm">

      <SearchIcon
        className="absolute left-4 top-3.5 text-gray-400"
        size={18}
      />

      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-gray-300 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
      />

    </div>
  );
}