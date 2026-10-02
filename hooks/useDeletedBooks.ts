"use client";

import { useEffect, useState } from "react";

export default function useDeletedBooks() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDeletedBooks() {
    try {
      setLoading(true);

      const res = await fetch("/api/deleted-books");

      const data = await res.json();

      if (data.success) {
        setBooks(data.books || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeletedBooks();
  }, []);

  return {
    books,
    loading,
    fetchDeletedBooks,
  };
}